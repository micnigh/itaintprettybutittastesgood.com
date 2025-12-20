import { FC, useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import recipes from '../recipes.json'
import { slugify } from '../utils'
import type { Recipe } from '../types/recipe'
import Fraction from 'fraction.js'
import { parseQuantity } from '../utils/recipe'
import RecipeHeader from '../components/Recipe/RecipeHeader'
import ServingsSelector from '../components/Recipe/ServingsSelector'
import IngredientsList from '../components/Recipe/IngredientsList'

const Recipe: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { slug } = useParams<{ slug: string }>()
  const recipe = (recipes as Recipe[]).find((r) => slugify(r.title) === slug)

  const originalServings = useMemo(() => {
    if (recipe?.metadata?.servings) {
      const match = recipe.metadata.servings.match(/(\d+)/)
      return match ? parseInt(match[1], 10) : 1
    }
    return 1
  }, [recipe])

  const [servings, setServings] = useState<string>(originalServings.toString())

  if (!recipe) {
    return <div>Recipe not found</div>
  }

  const servingsFraction =
    parseQuantity(servings) || new Fraction(originalServings)

  return (
    <>
      <RecipeHeader recipe={recipe} />

      <article className="prose max-w-none prose-img:rounded-xl">
        {recipe.heroImage && (
          <img
            src={`/recipes/${slug}/${recipe.heroImage}`}
            alt={recipe.title}
            className="rounded-lg inline-block float-right w-full h-full sm:max-w-[500px] sm:max-h-[500px] ml-8 my-8"
          />
        )}

        {recipe.summary && (
          <ReactMarkdown>{`### Summary\n${recipe.summary}`}</ReactMarkdown>
        )}

        <h3>Ingredients</h3>
        <ServingsSelector
          servings={servings}
          setServings={setServings}
          originalServings={originalServings}
        />
        <IngredientsList
          ingredients={recipe.ingredients}
          servingsFraction={servingsFraction}
          originalServings={originalServings}
        />

        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {`### Preparation\n${recipe.preparation || ''}`}
        </ReactMarkdown>
      </article>
    </>
  )
}

export default Recipe
