import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  generateRecipesJson,
  loadRecipesFromDirectory,
} from './generate-recipes-json'
import type { Recipe } from '../src/types/recipe'

let tempDir: string

const recipe = (slug: string, title: string): Recipe => ({
  id: slug,
  slug,
  title,
  ingredients: [],
  markdown: '',
})

describe('generateRecipesJson', () => {
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'recipes-json-'))
  })

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true })
  })

  it('writes all recipe index files in deterministic directory order', async () => {
    const recipesDir = path.join(tempDir, 'public', 'recipes')
    const outputPath = path.join(tempDir, 'src', 'recipes.json')

    await fs.mkdir(path.join(recipesDir, 'z-recipe'), { recursive: true })
    await fs.mkdir(path.join(recipesDir, 'a-recipe'), { recursive: true })
    await fs.writeFile(
      path.join(recipesDir, 'z-recipe', 'index.json'),
      JSON.stringify(recipe('z-recipe', 'Z Recipe'))
    )
    await fs.writeFile(
      path.join(recipesDir, 'a-recipe', 'index.json'),
      JSON.stringify(recipe('a-recipe', 'A Recipe'))
    )

    const recipes = await generateRecipesJson({ recipesDir, outputPath })
    const output = JSON.parse(
      await fs.readFile(outputPath, 'utf-8')
    ) as Recipe[]

    expect(recipes.map(({ slug }) => slug)).toEqual(['a-recipe', 'z-recipe'])
    expect(output.map(({ slug }) => slug)).toEqual(['a-recipe', 'z-recipe'])
  })

  it('returns an empty list when the recipes directory has no recipe folders', async () => {
    const recipesDir = path.join(tempDir, 'public', 'recipes')
    await fs.mkdir(recipesDir, { recursive: true })

    await expect(loadRecipesFromDirectory(recipesDir)).resolves.toEqual([])
  })

  it('ignores non-directory entries in the recipes directory', async () => {
    const recipesDir = path.join(tempDir, 'public', 'recipes')
    const recipeDir = path.join(recipesDir, 'solo-recipe')

    await fs.mkdir(recipeDir, { recursive: true })
    await fs.writeFile(path.join(recipesDir, 'README.txt'), 'ignore me')
    await fs.writeFile(
      path.join(recipeDir, 'index.json'),
      JSON.stringify(recipe('solo-recipe', 'Solo Recipe'))
    )

    const recipes = await loadRecipesFromDirectory(recipesDir)

    expect(recipes).toHaveLength(1)
    expect(recipes[0]?.slug).toBe('solo-recipe')
  })

  it('creates nested output directories before writing recipes.json', async () => {
    const recipesDir = path.join(tempDir, 'public', 'recipes')
    const outputPath = path.join(tempDir, 'nested', 'src', 'recipes.json')
    const recipeDir = path.join(recipesDir, 'nested-recipe')

    await fs.mkdir(recipeDir, { recursive: true })
    await fs.writeFile(
      path.join(recipeDir, 'index.json'),
      JSON.stringify(recipe('nested-recipe', 'Nested Recipe'))
    )

    await generateRecipesJson({ recipesDir, outputPath })

    await expect(fs.access(outputPath)).resolves.toBeUndefined()
    const output = JSON.parse(
      await fs.readFile(outputPath, 'utf-8')
    ) as Recipe[]
    expect(output).toHaveLength(1)
    expect(output[0]?.slug).toBe('nested-recipe')
  })
})
