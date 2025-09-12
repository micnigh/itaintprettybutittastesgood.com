import React from 'react';
import { Link } from 'react-router-dom';
import recipes from '../recipes.json';

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const Home = () => {
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
