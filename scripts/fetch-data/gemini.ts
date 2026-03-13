import { promises as fs } from 'fs'
import path from 'path'

import { GoogleGenAI } from '@google/genai'
import {
  Ingredient,
  Recipe,
  contentGenerationModel,
  imageGenerationModel,
} from './config'

export interface ImageGenerationExtras {
  additionalPrompt?: string
  exampleImagePaths?: string[]
}

async function getIngredientsWithGemini(
  markdownContent: string
): Promise<Ingredient[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in the .env file.')
  }
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

  const prompt = `
    Analyze the following recipe text and extract the ingredients.
    Return the ingredients as a JSON array, where each object has "name", "quantity", and "unit".
    If a quantity or unit is not specified, set it to null.
    For example: "2 cups of flour" should be { "name": "flour", "quantity": "2", "unit": "cups" }.
    "a pinch of salt" should be { "name": "salt", "quantity": "a pinch", "unit": null }.
    "1 egg" should be { "name": "egg", "quantity": "1", "unit": null }.
    "½ cup + 1 tablespoon mascarpone" should be { "name": "mascarpone", "quantity": "9", "unit": "tablespoons" }.
    "1/2 cup of sugar" should be { "name": "sugar", "quantity": "0.5", "unit": "cups" }.
    "Couple Ham Hawks smoked" should be { "name": "ham hawks smoked", "quantity": "3", "unit": null }.
    Here is the recipe:
    ---
    ${markdownContent}
    ---
    
    Return only the JSON array.
  `

  const MAX_RETRIES = 5
  let attempt = 0
  let delay = 1000 // start with 1 second

  while (attempt < MAX_RETRIES) {
    try {
      const result = await genAI.models.generateContent({
        model: contentGenerationModel,
        contents: [prompt],
      })
      const text = result.text
      if (!text) {
        console.error(
          'Error: Could not find a valid JSON array in the Gemini response for the document.'
        )
        return []
      }
      // Clean the response to ensure it's valid JSON.
      // The model often wraps the JSON in Markdown fences (```json ... ```).
      const startIndex = text.indexOf('[')
      const endIndex = text.lastIndexOf(']')

      if (startIndex === -1 || endIndex === -1) {
        console.error(
          'Error: Could not find a valid JSON array in the Gemini response for the document.'
        )
        console.error('Response text:', text)
        return []
      }

      const jsonString = text.substring(startIndex, endIndex + 1)
      const ingredients: Ingredient[] = JSON.parse(jsonString)

      return ingredients.map((ingredient) => {
        if (
          ingredient.quantity &&
          typeof ingredient.quantity === 'string' &&
          ingredient.quantity.includes('-')
        ) {
          const newQuantity = ingredient.quantity.split('-')[0].trim()
          return { ...ingredient, quantity: newQuantity }
        }
        return ingredient
      })
    } catch (error: any) {
      if (error.status === 503 && attempt < MAX_RETRIES - 1) {
        console.warn(
          `Gemini API returned 503. Retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${MAX_RETRIES})`
        )
        await new Promise((res) => setTimeout(res, delay))
        delay *= 2 // Exponential backoff
        attempt++
      } else {
        console.error(
          'Error calling Gemini API or parsing its response:',
          error
        )
        return [] // Return an empty array on non-retriable error or after max retries
      }
    }
  }
  return [] // Should not be reached if MAX_RETRIES > 0
}

export function buildImagePrompt(
  recipe: Recipe,
  options?: { quirky?: string; additionalPrompt?: string }
): string {
  const ingredientsText = recipe.ingredients
    .map((i) => `${i.quantity || ''} ${i.unit || ''} ${i.name}`.trim())
    .join(', ')
  const quirkyAddition =
    options?.quirky ?? (Math.random() < 0.5 ? 'a garden gnome' : 'a flamingo')

  let prompt = `
    A photorealistic, appetizing, and well-lit image of ${recipe.title}.
    Summary: ${recipe.summary}
    Ingredients: ${ingredientsText}
    Tags: ${recipe.metadata?.tags?.join(', ')}
    The image should be high quality and suitable for a recipe website.
    Do not include any letters or text in the image.
    Make sure the picture includes ${quirkyAddition} in it.
  `
  if (options?.additionalPrompt?.trim()) {
    prompt += `\n\nAdditional instructions: ${options.additionalPrompt.trim()}`
  }
  return prompt
}

const EXAMPLE_IMAGE_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

async function describeExampleImagesForPrompt(
  genAI: InstanceType<typeof GoogleGenAI>,
  imagePaths: string[]
): Promise<string | undefined> {
  const parts: Array<{
    text?: string
    inlineData?: { data: string; mimeType: string }
  }> = [
    {
      text: `These ${imagePaths.length} image(s) show what the dish/food looks like. In 1–3 short sentences, describe only the appearance of the food itself: color, texture, shape, and any distinctive visual traits. Do NOT describe what it is baked on, plated on, or served on; do NOT describe photography style, lighting, composition, or mood—we will use a professional recipe-website photo style separately. Output only the description of the food itself, no preamble.`,
    },
  ]
  for (const imagePath of imagePaths) {
    try {
      const buf = await fs.readFile(imagePath)
      const ext = path.extname(imagePath).toLowerCase()
      const mimeType = EXAMPLE_IMAGE_MIME[ext] ?? 'image/jpeg'
      parts.push({
        inlineData: { data: buf.toString('base64'), mimeType },
      })
    } catch {
      // Skip unreadable file
    }
  }
  if (parts.length <= 1) return undefined
  try {
    const result = await genAI.models.generateContent({
      model: contentGenerationModel,
      contents: parts,
    })
    const text = result.text?.trim()
    return text || undefined
  } catch {
    return undefined
  }
}

async function generateImageWithGemini(
  recipe: Recipe,
  extras?: ImageGenerationExtras
): Promise<{ buffer: Buffer; mimeType: string; prompt: string } | undefined> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in the .env file.')
  }
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

  let prompt = buildImagePrompt(recipe, {
    additionalPrompt: extras?.additionalPrompt,
  })
  if (extras?.exampleImagePaths?.length) {
    const described = await describeExampleImagesForPrompt(
      genAI,
      extras.exampleImagePaths
    )
    if (described) {
      prompt += `\n\nThe dish should look like this: ${described}`
    }
  }

  const MAX_RETRIES = 5
  let attempt = 0
  let delay = 1000 // start with 1 second

  while (attempt < MAX_RETRIES) {
    try {
      const result = await genAI.models.generateImages({
        model: imageGenerationModel,
        prompt,
        config: { numberOfImages: 1 },
      })
      const image = result.generatedImages?.[0]?.image!
      if (!image) {
        console.warn(`Gemini did not return an image for ${recipe.title}.`)
        return undefined
      }

      return {
        buffer: Buffer.from(image.imageBytes!, 'base64'),
        mimeType: image.mimeType!,
        prompt,
      }
    } catch (error: any) {
      if (error.status === 503 && attempt < MAX_RETRIES - 1) {
        console.warn(
          `Gemini API returned 503. Retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${MAX_RETRIES})`
        )
        await new Promise((res) => setTimeout(res, delay))
        delay *= 2 // Exponential backoff
        attempt++
      } else {
        console.error(`Error generating image for ${recipe.title}:`, error)
        return undefined
      }
    }
  }
  return undefined
}

export { getIngredientsWithGemini, generateImageWithGemini }
