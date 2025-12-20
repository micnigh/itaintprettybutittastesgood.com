import Fraction from 'fraction.js'

// Unicode fraction characters mapped to their ASCII fraction equivalents
const UNICODE_FRACTIONS: { [key: string]: string } = {
  '¼': '1/4',
  '½': '1/2',
  '¾': '3/4',
  '⅐': '1/7',
  '⅑': '1/9',
  '⅒': '1/10',
  '⅓': '1/3',
  '⅔': '2/3',
  '⅕': '1/5',
  '⅖': '2/5',
  '⅗': '3/5',
  '⅘': '4/5',
  '⅙': '1/6',
  '⅚': '5/6',
  '⅛': '1/8',
  '⅜': '3/8',
  '⅝': '5/8',
  '⅞': '7/8',
}

/**
 * Parses a quantity string (which may contain unicode fractions) into a Fraction object.
 * Handles unicode fraction characters, ranges (e.g., "1-2"), and standard fraction notation.
 */
export const parseQuantity = (
  quantity: string | null | undefined
): Fraction | null => {
  if (!quantity) return null
  let processedQuantity = quantity.trim()
  try {
    // Replace unicode fractions with ASCII equivalents
    for (const [uni, asc] of Object.entries(UNICODE_FRACTIONS)) {
      processedQuantity = processedQuantity.replace(uni, asc)
    }

    // Handle ranges by taking the first value
    if (processedQuantity.includes('-')) {
      processedQuantity = processedQuantity.split('-')[0].trim()
    }

    return new Fraction(processedQuantity)
  } catch {
    return null
  }
}

export const formatQuantity = (quantity: Fraction | null): string => {
  if (!quantity) return ''
  return quantity.toFraction(true)
}

/**
 * Automatically converts units to more appropriate sizes when quantities are small.
 * For example: converts cups to tablespoons when < 0.25 cups, and tablespoons to teaspoons when < 1 tablespoon.
 */
export const autoConvertUnits = (
  quantity: Fraction,
  unit: string | null
): { quantity: Fraction; unit: string | null } => {
  if (!unit) return { quantity, unit }

  let currentQuantity = quantity
  let currentUnit = unit.toLowerCase().replace(/s$/, '')

  // Convert cups to tablespoons if quantity is less than 0.25 cups
  if (currentUnit === 'cup') {
    if (currentQuantity.valueOf() < 0.25) {
      currentQuantity = currentQuantity.mul(16)
      currentUnit = 'tablespoon'
    }
  }

  // Convert tablespoons to teaspoons if quantity is less than 1 tablespoon
  if (currentUnit === 'tablespoon') {
    if (currentQuantity.valueOf() < 1) {
      currentQuantity = currentQuantity.mul(3)
      currentUnit = 'teaspoon'
    }
  }

  const finalUnit =
    currentQuantity.valueOf() > 1 ? `${currentUnit}s` : currentUnit

  return { quantity: currentQuantity, unit: finalUnit }
}

