import { FC } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Recipe } from '../../types/recipe'

interface RecipeCardProps {
  recipe: Recipe
}

const RecipeCard: FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <motion.div
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
}

export default RecipeCard
