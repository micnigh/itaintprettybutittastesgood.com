import { drive_v3, docs_v1 } from 'googleapis'
import { promises as fs } from 'fs'
import path from 'path'
import PQueue from 'p-queue'

import { RECIPES_DIR, CACHE_DIR, Recipe, Ingredient } from './config'
import { slugify } from './utils'
import { fetchDoc } from './google-api'
import { parseGdoc, parseYamlMetadata } from './gdoc-parser'
import { getIngredientsWithGemini, generateImageWithGemini } from './gemini'

interface Queues {
  googleDocQueue: PQueue
  textProcessingQueue: PQueue
  imageGenerationQueue: PQueue
}

export type { Queues }

export async function processDoc(
  file: drive_v3.Schema$File,
  auth: any,
  queues: Queues
) {
  const slug = slugify(file.name || '')
  const recipeDir = path.join(RECIPES_DIR, slug)
  await fs.mkdir(recipeDir, { recursive: true })

  const cachePath = path.join(CACHE_DIR, `${slug}.json`)
  const recipePath = path.join(recipeDir, `index.json`)

  // Stage 1: Fetch from Google Docs API only if modification time has changed
  let doc: docs_v1.Schema$Document | undefined
  try {
    const cachedData = await fs.readFile(cachePath, 'utf-8')
    const cachedDoc: docs_v1.Schema$Document & { modifiedTime: string } =
      JSON.parse(cachedData)

    if (file.modifiedTime !== cachedDoc.modifiedTime) {
      console.log(
        `[FETCH] Modification change detected, re-fetching: ${file.name}`
      )
      doc = (await queues.googleDocQueue.add(() =>
        fetchDoc(auth, file.id!)
      )) as docs_v1.Schema$Document
      // Add modifiedTime to the document for caching
      const docWithModifiedTime = { ...doc, modifiedTime: file.modifiedTime! }
      await fs.writeFile(
        cachePath,
        JSON.stringify(docWithModifiedTime, null, 2)
      )
      doc = docWithModifiedTime as docs_v1.Schema$Document
    } else {
      // console.log(`[FETCH] Using raw cache for: ${file.name}`);
    }
  } catch (error) {
    // Not in raw cache
    console.log(`[FETCH] Not in cache, fetching: ${file.name}`)
    doc = (await queues.googleDocQueue.add(() =>
      fetchDoc(auth, file.id!)
    )) as docs_v1.Schema$Document
    // Add modifiedTime to the document for caching
    const docWithModifiedTime = { ...doc, modifiedTime: file.modifiedTime! }
    await fs.writeFile(cachePath, JSON.stringify(docWithModifiedTime, null, 2))
    doc = docWithModifiedTime as docs_v1.Schema$Document
  }

  // Stage 2: Process with Vertex AI only if necessary
  let shouldProcess = false
  try {
    const recipeStat = await fs.stat(recipePath)
    const cacheStat = await fs.stat(cachePath)

    if (cacheStat.mtime > recipeStat.mtime) {
      console.log(`[PROCESS] Raw data updated, re-processing: ${file.name}`)
      shouldProcess = true
    }

    // Additionally, check if the recipe is missing a hero image
    if (!shouldProcess) {
      const recipeContent = await fs.readFile(recipePath, 'utf-8')
      const existingRecipe: Recipe = JSON.parse(recipeContent)
      if (!existingRecipe.heroImage) {
        console.log(
          `[PROCESS] Recipe is missing hero image, re-processing: ${file.name}`
        )
        shouldProcess = true
      }
    }
  } catch (error) {
    // Not in processed recipe cache
    console.log(`[PROCESS] New recipe, processing: ${file.name}`)
    shouldProcess = true
  }

  if (shouldProcess) {
    if (!doc) {
      const cachedData = await fs.readFile(cachePath, 'utf-8')
      doc = JSON.parse(cachedData)
    }
    const {
      markdown,
      summary,
      ingredients: ingredientsMarkdown,
      preparation,
      imagePaths,
    } = await parseGdoc(
      doc as docs_v1.Schema$Document,
      recipeDir,
      auth,
      queues.googleDocQueue
    )
    const ingredients = (await queues.textProcessingQueue.add(() =>
      getIngredientsWithGemini(ingredientsMarkdown || markdown)
    )) as Ingredient[]
    const metadata = parseYamlMetadata(file.description || '')

    const recipe: Recipe = {
      id: doc?.documentId!,
      slug: slug,
      title: doc?.title!,
      ingredients,
      markdown,
      summary,
      preparation,
      metadata,
    }

    if (imagePaths.length > 0) {
      recipe.heroImage = imagePaths[0]
    } else {
      console.log(
        `[PROCESS] No image found for ${recipe.title}, generating one...`
      )
      const imageData = await queues.imageGenerationQueue.add(() =>
        generateImageWithGemini(recipe)
      )
      if (imageData) {
        try {
          const extension = imageData.mimeType.split('/')[1] || 'jpeg'
          const filename = `generated-hero.${extension}`
          await fs.writeFile(path.join(recipeDir, filename), imageData.buffer)
          recipe.heroImage = filename
          console.log(
            `[PROCESS] Successfully generated and saved image for ${recipe.title}`
          )
        } catch (e) {
          console.error(
            `[PROCESS] Failed to save generated image for ${recipe.title}`,
            e
          )
        }
      }
    }

    await fs.writeFile(recipePath, JSON.stringify(recipe, null, 2))
  }
}
