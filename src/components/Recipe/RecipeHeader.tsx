import { FC } from 'react'
import { format } from 'date-fns'
import type { Recipe } from '../../types/recipe'
import { parseServingsFromMetadata } from '../../utils/recipe'

interface RecipeHeaderProps {
  recipe: Recipe
}

const RecipeHeader: FC<RecipeHeaderProps> = ({ recipe }) => {
  const originalServings = parseServingsFromMetadata(recipe.metadata?.servings)

  return (
    <>
      <div className="flex flex-row items-baseline space-x-2">
        <span className="w-max">
          <h1 className="text-3xl font-bold mt-4 sm:mt-6 mr-4">
            {recipe.title}
          </h1>
          {recipe.metadata?.date && (
            <div className="text-sm text-gray-500 mb-4">
              {format(new Date(recipe.metadata.date), 'MMM d, yyyy')}
            </div>
          )}
        </span>
        {recipe.metadata?.tags && (
          <span className="flex-grow min-w-48">
            {recipe.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-400 text-white whitespace-nowrap rounded-full px-2 py-0.5 text-sm mr-4 mb-4 inline-block"
              >
                {tag}
              </span>
            ))}
          </span>
        )}
      </div>
      <ul className="flex flex-row gap-4 mb-2">
        {recipe.metadata?.level && <li>Level: {recipe.metadata.level}</li>}
        {recipe.metadata?.prep && <li>Prep: {recipe.metadata.prep}</li>}
        {recipe.metadata?.cook && <li>Cook: {recipe.metadata.cook}</li>}
        {recipe.metadata?.servings && <li>Servings: {originalServings}</li>}
      </ul>
    </>
  )
}

export default RecipeHeader
