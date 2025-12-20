import { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import recipes from '../recipes.json'
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
  const filteredRecipes = useMemo(
    () =>
      (recipes as Recipe[]).filter((recipe) =>
        recipe.title.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      <AnimatePresence>
        {filteredRecipes.map((recipe) => {
          return (
            <motion.div
              key={recipe.id}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                opacity: { duration: 0.2 },
                y: { duration: 0.2 },
              }}
              layout
            >
              <Link to={`/recipe/${recipe.slug}`}>
                {recipe.heroImage && (
                  <img
                    src={`/recipes/${recipe.slug}/${recipe.heroImage}`}
                    alt={recipe.title}
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                )}
              </Link>
              <Link
                to={`/recipe/${recipe.slug}`}
                className="text-lg text-text hover:underline mt-2 inline-block"
              >
                {recipe.title}
              </Link>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default Home
