import { GoogleGenAI } from '@google/genai'
import {
  Ingredient,
  Recipe,
  contentGenerationModel,
  imageGenerationModel,
} from './config'

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

async function generateImageWithGemini(
  recipe: Recipe
): Promise<{ buffer: Buffer; mimeType: string } | undefined> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in the .env file.')
  }
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

  const ingredientsText = recipe.ingredients
    .map((i) => `${i.quantity || ''} ${i.unit || ''} ${i.name}`.trim())
    .join(', ')
  const quirkyAddition = Math.random() < 0.5 ? 'a garden gnome' : 'a flamingo'

  const prompt = `
    A photorealistic, appetizing, and well-lit image of ${recipe.title}.
    Summary: ${recipe.summary}
    Ingredients: ${ingredientsText}
    Tags: ${recipe.metadata?.tags?.join(', ')}
    The image should be high quality and suitable for a recipe website.
    Please don't add any text to the image unless its written on an object in the image like a recipe card or a cookbook.
    Please don't use typos or spelling errors anywhere in text of the image.
    Make sure the picture includes ${quirkyAddition} in it.
  `

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
