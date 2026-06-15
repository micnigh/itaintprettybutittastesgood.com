import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { generateRecipesJson, loadRecipesFromDirectory } from './generate-recipes-json'
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

  it('ignores non-directory entries and returns an empty list when no recipes exist', async () => {
    const recipesDir = path.join(tempDir, 'public', 'recipes')
    const outputPath = path.join(tempDir, 'src', 'recipes.json')

    await fs.mkdir(recipesDir, { recursive: true })
    await fs.writeFile(path.join(recipesDir, 'README.md'), 'not a recipe')

    const recipes = await generateRecipesJson({ recipesDir, outputPath })
    const output = JSON.parse(await fs.readFile(outputPath, 'utf-8')) as Recipe[]

    expect(recipes).toEqual([])
    expect(output).toEqual([])
  })

  it('creates the output parent directory and writes a trailing newline', async () => {
    const recipesDir = path.join(tempDir, 'nested', 'public', 'recipes')
    const outputPath = path.join(tempDir, 'nested', 'src', 'recipes.json')

    await fs.mkdir(path.join(recipesDir, 'solo'), { recursive: true })
    await fs.writeFile(
      path.join(recipesDir, 'solo', 'index.json'),
      JSON.stringify(recipe('solo', 'Solo Recipe'))
    )

    await generateRecipesJson({ recipesDir, outputPath })
    const raw = await fs.readFile(outputPath, 'utf-8')

    expect(raw.endsWith('\n')).toBe(true)
    expect(JSON.parse(raw)).toEqual([recipe('solo', 'Solo Recipe')])
  })
})

describe('loadRecipesFromDirectory', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'recipes-json-'))
  })

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true })
  })

  it('loads only recipe directories in sorted order', async () => {
    const recipesDir = path.join(tempDir, 'recipes')

    await fs.mkdir(path.join(recipesDir, 'm-recipe'), { recursive: true })
    await fs.mkdir(path.join(recipesDir, 'b-recipe'), { recursive: true })
    await fs.writeFile(
      path.join(recipesDir, 'm-recipe', 'index.json'),
      JSON.stringify(recipe('m-recipe', 'M Recipe'))
    )
    await fs.writeFile(
      path.join(recipesDir, 'b-recipe', 'index.json'),
      JSON.stringify(recipe('b-recipe', 'B Recipe'))
    )
    await fs.writeFile(path.join(recipesDir, 'notes.txt'), 'ignore me')

    const recipes = await loadRecipesFromDirectory(recipesDir)

    expect(recipes.map(({ slug }) => slug)).toEqual(['b-recipe', 'm-recipe'])
  })
})
