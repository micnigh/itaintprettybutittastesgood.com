// rate limits
// https://ai.google.dev/gemini-api/docs/rate-limits#tier-1
// models
// https://ai.google.dev/gemini-api/docs/models
export const imageGenerationModel = 'imagen-4.0-generate-001'
export const contentGenerationModel = 'gemini-2.5-flash'

export const CONCURRENCY = {
  // Google Docs and Drive APIs
  GOOGLE_DOC_RETRIEVAL: 10,
  // Gemini text generation
  TEXT_PROCESSING: 10,
  TEXT_PROCESSING_RPM: 1000, // RPM for gemini-2.5-flash
  // Gemini image generation
  IMAGE_GENERATION: 10,
  IMAGE_GENERATION_RPM: 10, // RPM for imagen-4.0-generate-001
}

import path from 'path'

export const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')
export const FOLDER_ID = '1Karp6fSxF4ZkO9A8Og585LZ_PP-LS2_n' // <-- ADD YOUR FOLDER ID HERE
export const CACHE_DIR = path.join(process.cwd(), 'cache/google-docs')
export const RECIPES_DIR = path.join(process.cwd(), 'public/recipes')

export interface Credentials {
  client_email: string
  private_key: string
}

export type {
  Ingredient,
  Recipe,
  RecipeMetadata,
} from '../../src/types/recipe'
