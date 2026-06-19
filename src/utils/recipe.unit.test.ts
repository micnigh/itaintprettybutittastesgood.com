import { describe, it, expect } from 'vitest'
import Fraction from 'fraction.js'
import type { Recipe } from '../types/recipe'
import {
  autoConvertUnits,
  filterRecipes,
  formatQuantity,
  parseQuantity,
  parseServingsFromMetadata,
} from './recipe'

const recipe = (
  title: string,
  tags: string[] = []
): Recipe => ({
  id: title.toLowerCase().replace(/\s+/g, '-'),
  slug: title.toLowerCase().replace(/\s+/g, '-'),
  title,
  ingredients: [],
  markdown: '',
  metadata:
    tags.length > 0
      ? {
          date: '',
          prep: '',
          cook: '',
          servings: '4',
          level: '',
          tags,
        }
      : undefined,
})

describe('filterRecipes', () => {
  const recipes = [
    recipe('Cranberry Sauce', ['holiday', 'sauce']),
    recipe('Chocolate Cake', ['dessert']),
    recipe('Green Salad', ['salad', 'healthy']),
  ]

  it('returns all recipes when search is empty or whitespace', () => {
    expect(filterRecipes(recipes, '')).toEqual(recipes)
    expect(filterRecipes(recipes, '   ')).toEqual(recipes)
    expect(filterRecipes(recipes, null)).toEqual(recipes)
    expect(filterRecipes(recipes, undefined)).toEqual(recipes)
  })

  it('matches title case-insensitively', () => {
    expect(filterRecipes(recipes, 'cranberry').map((r) => r.title)).toEqual([
      'Cranberry Sauce',
    ])
    expect(filterRecipes(recipes, 'CAKE').map((r) => r.title)).toEqual([
      'Chocolate Cake',
    ])
  })

  it('matches tags as well as titles', () => {
    expect(filterRecipes(recipes, 'holiday').map((r) => r.title)).toEqual([
      'Cranberry Sauce',
    ])
    expect(filterRecipes(recipes, 'dessert').map((r) => r.title)).toEqual([
      'Chocolate Cake',
    ])
  })

  it('does not search ingredients or markdown', () => {
    const withMarkdown = [
      ...recipes,
      {
        ...recipe('Plain Title'),
        markdown: 'secret chocolate ingredient',
      },
    ]
    expect(filterRecipes(withMarkdown, 'secret')).toEqual([])
    expect(filterRecipes(withMarkdown, 'ingredient')).toEqual([])
  })

  it('returns empty array when nothing matches', () => {
    expect(filterRecipes(recipes, 'pizza')).toEqual([])
  })
})

describe('parseQuantity', () => {
  it('parses unicode fractions and ranges', () => {
    expect(parseQuantity('½')?.valueOf()).toBe(0.5)
    expect(parseQuantity('1-2 cups')?.valueOf()).toBe(1)
  })

  it('returns null for empty or invalid input', () => {
    expect(parseQuantity('')).toBeNull()
    expect(parseQuantity(null)).toBeNull()
    expect(parseQuantity('not-a-quantity')).toBeNull()
  })
})

describe('formatQuantity', () => {
  it('formats fractions and returns empty for null', () => {
    expect(formatQuantity(new Fraction(1, 2))).toBe('1/2')
    expect(formatQuantity(null)).toBe('')
  })
})

describe('parseServingsFromMetadata', () => {
  it('extracts first number from servings string', () => {
    expect(parseServingsFromMetadata('4 servings')).toBe(4)
    expect(parseServingsFromMetadata('Serves 12')).toBe(12)
  })

  it('defaults to 1 when missing or unparsable', () => {
    expect(parseServingsFromMetadata(undefined)).toBe(1)
    expect(parseServingsFromMetadata('many')).toBe(1)
  })
})

describe('autoConvertUnits', () => {
  it('converts small cup amounts to tablespoons', () => {
    const { quantity, unit } = autoConvertUnits(new Fraction(1, 8), 'cup')
    expect(quantity.valueOf()).toBe(2)
    expect(unit).toBe('tablespoons')
  })

  it('converts small tablespoon amounts to teaspoons', () => {
    const { quantity, unit } = autoConvertUnits(new Fraction(1, 2), 'tablespoon')
    expect(quantity.valueOf()).toBe(1.5)
    expect(unit).toBe('teaspoons')
  })

  it('leaves large quantities unchanged', () => {
    const input = new Fraction(1)
    const { quantity, unit } = autoConvertUnits(input, 'cup')
    expect(quantity).toBe(input)
    expect(unit).toBe('cup')
  })
})
