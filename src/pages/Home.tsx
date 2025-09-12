import { FC } from 'react';
import { Link } from 'react-router-dom';
import recipes from '../recipes.json';
import { slugify } from '../utils';

const Home: FC = () => {
  return (
    <div>
      <h1>All Recipes</h1>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <Link to={`/recipe/${slugify(recipe.title)}`}>{recipe.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
