import { FC } from 'react'
import { Link } from 'react-router-dom'
import recipes from '../recipes.json'
import PlacePuppy from '../components/placepuppy'
import { useStore } from '../App'
interface Recipe {
  id: string
  slug: string
  title: string
  heroImage?: string
  markdown: string
}

const Home: FC = () => {
  const { search } = useStore()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {(recipes as Recipe[])
        .filter((recipe) =>
          recipe.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((recipe, index) => {
          return (
            <div key={recipe.id} className="text-center">
              <Link to={`/recipe/${recipe.slug}`}>
                {recipe.heroImage ? (
                  <img
                    src={`/recipes/${recipe.slug}/${recipe.heroImage}`}
                    alt={recipe.title}
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <PlacePuppy
                    width={200}
                    height={150}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                    index={index}
                  />
                )}
              </Link>
              <Link
                to={`/recipe/${recipe.slug}`}
                className="text-lg text-text hover:underline mt-2 inline-block"
              >
                {recipe.title}
              </Link>
            </div>
          )
        })}
    </div>
  )
}

export default Home
