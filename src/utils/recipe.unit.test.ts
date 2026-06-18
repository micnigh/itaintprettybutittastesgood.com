import { describe, it, expect } from 'vitest'
import { filterRecipes } from './recipe'
import type { Recipe } from '../types/recipe'

const baseRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  id: '1',
  slug: 'chocolate-cake',
  title: 'Chocolate Cake',
  ingredients: [{ name: 'chocolate', quantity: '1', unit: 'cup' }],
  markdown: 'Mix chocolate and bake.',
  summary: 'A rich dessert with chocolate',
  metadata: {
    date: '2025-01-01',
    prep: '10 min',
    cook: '30 min',
    servings: '8',
    level: 'easy',
    tags: ['dessert', 'baking'],
  },
  ...overrides,
})

describe('filterRecipes', () => {
  const recipes = [
    baseRecipe(),
    baseRecipe({
      id: '2',
      slug: 'apple-pie',
      title: 'Apple Pie',
      ingredients: [{ name: 'apples', quantity: '4', unit: null }],
      summary: 'Classic fruit pie',
      metadata: {
        date: '2025-01-01',
        prep: '20 min',
        cook: '45 min',
        servings: '6',
        level: 'medium',
        tags: ['dessert', 'fruit'],
      },
    }),
  ]

  it('returns all recipes when the query is empty or whitespace', () => {
    expect(filterRecipes(recipes, '')).toHaveLength(2)
    expect(filterRecipes(recipes, '   ')).toHaveLength(2)
    expect(filterRecipes(recipes, null)).toHaveLength(2)
    expect(filterRecipes(recipes, undefined)).toHaveLength(2)
  })

  it('matches title case-insensitively', () => {
    expect(filterRecipes(recipes, 'CHOCOLATE')).toEqual([recipes[0]])
    expect(filterRecipes(recipes, 'apple')).toEqual([recipes[1]])
  })

  it('matches tags but not ingredients or summary', () => {
    const flourCake = baseRecipe({
      slug: 'flour-cake',
      title: 'Flour Cake',
      ingredients: [{ name: 'chocolate chips', quantity: '1', unit: 'cup' }],
      summary: 'A rich dessert with chocolate',
    })
    const flourRecipes = [flourCake]

    expect(filterRecipes(recipes, 'baking')).toEqual([recipes[0]])
    expect(filterRecipes(recipes, 'fruit')).toEqual([recipes[1]])
    expect(filterRecipes(flourRecipes, 'chocolate')).toEqual([])
    expect(filterRecipes(recipes, 'apples')).toEqual([])
    expect(filterRecipes(flourRecipes, 'rich')).toEqual([])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterRecipes(recipes, 'savory')).toEqual([])
  })
})
