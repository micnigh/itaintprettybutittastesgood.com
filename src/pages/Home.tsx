import { FC, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { recipes } from '../data/recipes'
import { useStore } from '../store/search'
import { filterRecipes } from '../utils/recipe'
import RecipeCard from '../components/Recipe/RecipeCard'

const Home: FC = () => {
  const search = useStore((state) => state.search)
  const filteredRecipes = useMemo(
    () => filterRecipes(recipes, search),
    [search]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      <AnimatePresence>
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Home
