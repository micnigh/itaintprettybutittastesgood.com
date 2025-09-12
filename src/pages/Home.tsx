import { FC } from 'react';
import { Link } from 'react-router-dom';
import recipes from '../recipes.json';
import { slugify } from '../utils';

const Home: FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">All Recipes</h1>
      <ul className="list-disc pl-5">
        {recipes.map(recipe => (
          <li key={recipe.id} className="mb-2">
            <Link to={`/recipe/${slugify(recipe.title)}`} className="text-blue-600 hover:underline">{recipe.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
