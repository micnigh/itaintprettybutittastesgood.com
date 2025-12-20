import { promises as fs } from 'fs'
import path from 'path'
import 'dotenv/config'
import PQueue from 'p-queue'
import {
  CONCURRENCY,
  CREDENTIALS_PATH,
  FOLDER_ID,
  CACHE_DIR,
  RECIPES_DIR,
  Recipe,
} from './fetch-data/config'
import { authorize, listDocsRecursive } from './fetch-data/google-api'
import { processDoc } from './fetch-data/recipe-processor'
import { Queues } from './fetch-data/recipe-processor'

// SETUP INSTRUCTIONS
// 1. Follow this guide to create a service account and credentials:
//    https://developers.google.com/workspace/guides/create-credentials
// 2. Create a `credentials.json` file in the root of your project with the
//    downloaded credentials.
//
// Google Drive & Docs API Setup:
// 3. Enable the Google Docs API and Google Drive API for your project.
// 4. Share your Google Drive folder with the service account's email address.
// 5. Add the ID of your Google Drive folder to the `FOLDER_ID` variable below.
//    (e.g., .../folders/THIS_IS_THE_ID).
//
// Gemini API Setup (for ingredient parsing and image prompt generation):
// 6. Enable the Gemini API in your Google Cloud project.
// 7. Add your Gemini API key to a `.env` file in the root of your project:
//    GEMINI_API_KEY="YOUR_API_KEY_HERE"
//    Get your key from Google AI Studio: https://makersuite.google.com/app/apikey

async function main() {
  const noCache = process.argv.includes('--no-cache')

  if (noCache) {
    console.log('`--no-cache` flag detected. Cleaning cache directories...')
    // Clean up cache directories for a fresh run
    await fs.rm(CACHE_DIR, { recursive: true, force: true })
    await fs.rm(RECIPES_DIR, { recursive: true, force: true })
  }

  await fs.mkdir(CACHE_DIR, { recursive: true })
  await fs.mkdir(RECIPES_DIR, { recursive: true })

  if (FOLDER_ID === ('your-folder-id-here' as any)) {
    console.log('No folder ID provided. Please update `scripts/fetch-data.js`.')
    return
  }

  try {
    await fs.access(CREDENTIALS_PATH)
  } catch (error) {
    console.error('Error: `credentials.json` not found.')
    console.error(
      'Please follow the setup instructions in `scripts/fetch-data.js`.'
    )
    return
  }

  const auth = await authorize(CREDENTIALS_PATH)
  const docFiles = await listDocsRecursive(auth, FOLDER_ID)

  if (!docFiles || docFiles.length === 0) {
    console.log(
      'No Google Docs found in the specified folder or its subfolders.'
    )
    return
  }

  console.log(
    `Found ${docFiles.length} documents. Processing with modification-time-based cache...`
  )

  const docProcessingQueue = new PQueue({ concurrency: 10 })
  const googleDocQueue = new PQueue({
    concurrency: CONCURRENCY.GOOGLE_DOC_RETRIEVAL,
  })
  // Rate-limited queues: intervalCap limits requests per interval (60s) to respect API rate limits
  const textProcessingQueue = new PQueue({
    concurrency: CONCURRENCY.TEXT_PROCESSING,
    interval: 60000,
    intervalCap: CONCURRENCY.TEXT_PROCESSING_RPM,
  })
  const imageGenerationQueue = new PQueue({
    concurrency: CONCURRENCY.IMAGE_GENERATION,
    interval: 60000,
    intervalCap: CONCURRENCY.IMAGE_GENERATION_RPM,
  })

  const queues: Queues = {
    googleDocQueue,
    textProcessingQueue,
    imageGenerationQueue,
  }

  for (const file of docFiles) {
    docProcessingQueue.add(() => processDoc(file, auth, queues))
  }

  await docProcessingQueue.onIdle()

  // Combine all recipes into a single file for the app
  const allRecipes: Recipe[] = []
  const recipeDirs = await fs.readdir(RECIPES_DIR, { withFileTypes: true })
  for (const recipeDir of recipeDirs) {
    if (recipeDir.isDirectory()) {
      const content = await fs.readFile(
        path.join(RECIPES_DIR, recipeDir.name, 'index.json'),
        'utf-8'
      )
      allRecipes.push(JSON.parse(content))
    }
  }

  const finalOutputPath = path.join(process.cwd(), 'src', 'recipes.json')
  await fs.writeFile(finalOutputPath, JSON.stringify(allRecipes, null, 2))

  console.log(`Successfully processed ${docFiles.length} recipes.`)
}

main().catch(console.error)
