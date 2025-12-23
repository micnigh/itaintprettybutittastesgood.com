import { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { recipes } from '../data/recipes'
import { useRecipeServings } from '../hooks/useRecipeServings'
import RecipeHeader from '../components/Recipe/RecipeHeader'
import ServingsSelector from '../components/Recipe/ServingsSelector'
import IngredientsList from '../components/Recipe/IngredientsList'
import NotFound from './NotFound'

const Recipe: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { slug } = useParams<{ slug: string }>()
  const recipe = recipes.find((r) => r.slug === slug)

  const { originalServings, servings, setServings, servingsFraction } =
    useRecipeServings(recipe)

  if (!recipe) {
    return <NotFound />
  }

  return (
    <>
      <RecipeHeader recipe={recipe} />

      <article className="prose max-w-none prose-img:rounded-xl">
        {recipe.heroImage && (
          <img
            src={`/recipes/${slug}/${recipe.heroImage}`}
            alt={recipe.title}
            className="rounded-lg inline-block float-right w-full h-full sm:max-w-[500px] sm:max-h-[500px] ml-8 my-8"
            data-print-section="image"
          />
        )}

        {recipe.summary && (
          <div data-print-section="summary">
            <ReactMarkdown>{`### Summary\n${recipe.summary}`}</ReactMarkdown>
          </div>
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
