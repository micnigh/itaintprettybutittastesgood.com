import { FC } from 'react'
import Fraction from 'fraction.js'
import type { Ingredient } from '../../types/recipe'
import { parseQuantity, formatQuantity, autoConvertUnits } from '../../utils/recipe'

interface IngredientsListProps {
  ingredients: Ingredient[]
  servingsFraction: Fraction
  originalServings: number
}

const IngredientsList: FC<IngredientsListProps> = ({
  ingredients,
  servingsFraction,
  originalServings,
}) => {
  return (
    <ul data-testid="ingredients-list">
      {ingredients.map((ingredient) => {
        const originalQuantity = parseQuantity(ingredient.quantity)
        let scaledQuantityStr = ingredient.quantity || ''
        let displayUnit = ingredient.unit
        if (originalQuantity) {
          const multiplier = servingsFraction.valueOf() / originalServings
          const scaledQuantity = originalQuantity.mul(multiplier)
          const converted = autoConvertUnits(scaledQuantity, ingredient.unit)
          scaledQuantityStr = formatQuantity(converted.quantity)
          displayUnit = converted.unit
        }
        return (
          <li data-testid="ingredient" key={ingredient.name}>
            {scaledQuantityStr} {displayUnit} {ingredient.name}
          </li>
        )
      })}
    </ul>
  )
}

export default IngredientsList

