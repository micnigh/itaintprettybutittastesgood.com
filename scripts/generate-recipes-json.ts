import { promises as fs } from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import type { Recipe } from '../src/types/recipe'

interface GenerateRecipesJsonOptions {
  recipesDir?: string
  outputPath?: string
}

const DEFAULT_RECIPES_DIR = path.join(process.cwd(), 'public', 'recipes')
const DEFAULT_OUTPUT_PATH = path.join(process.cwd(), 'src', 'recipes.json')

export async function loadRecipesFromDirectory(
  recipesDir = DEFAULT_RECIPES_DIR
): Promise<Recipe[]> {
  const entries = await fs.readdir(recipesDir, { withFileTypes: true })

  return Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(async (entry) => {
        const content = await fs.readFile(
          path.join(recipesDir, entry.name, 'index.json'),
          'utf-8'
        )

        return JSON.parse(content) as Recipe
      })
  )
}

export async function generateRecipesJson(
  options: GenerateRecipesJsonOptions = {}
): Promise<Recipe[]> {
  const recipesDir = options.recipesDir ?? DEFAULT_RECIPES_DIR
  const outputPath = options.outputPath ?? DEFAULT_OUTPUT_PATH
  const recipes = await loadRecipesFromDirectory(recipesDir)

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify(recipes, null, 2)}\n`)

  return recipes
}

async function main() {
  const recipes = await generateRecipesJson()

  console.log(
    `Wrote ${recipes.length} recipes to ${path.relative(
      process.cwd(),
      DEFAULT_OUTPUT_PATH
    )}.`
  )
}

const entrypoint = process.argv[1]

if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  main().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
}
