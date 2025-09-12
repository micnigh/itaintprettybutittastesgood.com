import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import recipes from '../recipes.json';

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const Recipe = () => {
  const { slug } = useParams();
  const recipe = recipes.find(r => slugify(r.title) === slug);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }
  
  const Image = ({src, alt}) => {
    const imagePath = `/recipes/${slug}/${src}`;
    return <img src={imagePath} alt={alt} style={{maxWidth: '100%'}} />;
  }

  return (
    <div>
      <h1>{recipe.title}</h1>
      
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: Image,
        }}
      >
        {recipe.markdown}
      </ReactMarkdown>
    </div>
  );
};

export default Recipe;
