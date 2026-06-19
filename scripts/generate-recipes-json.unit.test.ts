import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { generateRecipesJson } from './generate-recipes-json'
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

  it('writes empty array when recipes directory has no recipe folders', async () => {
    const recipesDir = path.join(tempDir, 'public', 'recipes')
    const outputPath = path.join(tempDir, 'src', 'recipes.json')

    await fs.mkdir(recipesDir, { recursive: true })
    await fs.writeFile(path.join(recipesDir, 'README.txt'), 'not a recipe')

    const recipes = await generateRecipesJson({ recipesDir, outputPath })
    const output = JSON.parse(
      await fs.readFile(outputPath, 'utf-8')
    ) as Recipe[]

    expect(recipes).toEqual([])
    expect(output).toEqual([])
  })

  it('ignores non-directory entries in recipes folder', async () => {
    const recipesDir = path.join(tempDir, 'public', 'recipes')
    const outputPath = path.join(tempDir, 'src', 'recipes.json')

    await fs.mkdir(path.join(recipesDir, 'solo-recipe'), { recursive: true })
    await fs.writeFile(
      path.join(recipesDir, 'solo-recipe', 'index.json'),
      JSON.stringify(recipe('solo-recipe', 'Solo Recipe'))
    )
    await fs.writeFile(path.join(recipesDir, 'loose.json'), '{}')

    const recipes = await generateRecipesJson({ recipesDir, outputPath })

    expect(recipes.map(({ slug }) => slug)).toEqual(['solo-recipe'])
  })
})
