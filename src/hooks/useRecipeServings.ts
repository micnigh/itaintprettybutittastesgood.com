import { useState, useMemo } from 'react'
import Fraction from 'fraction.js'
import type { Recipe } from '../types/recipe'
import { parseQuantity, parseServingsFromMetadata } from '../utils/recipe'

/**
 * Hook to manage recipe servings calculation and scaling.
 * Returns the original servings count, current servings state, setter, and computed fraction.
 */
export const useRecipeServings = (recipe: Recipe | undefined) => {
  const originalServings = useMemo(() => {
    return parseServingsFromMetadata(recipe?.metadata?.servings)
  }, [recipe])

  const [servings, setServings] = useState<string>(originalServings.toString())

  const servingsFraction = useMemo(() => {
    return parseQuantity(servings) || new Fraction(originalServings)
  }, [servings, originalServings])

  return {
    originalServings,
    servings,
    setServings,
    servingsFraction,
  }
}
