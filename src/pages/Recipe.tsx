import { FC } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import recipes from '../recipes.json';
import { slugify } from '../utils';

interface ImageProps {
    src?: string;
    alt?: string;
}

const Recipe: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const recipe = recipes.find(r => slugify(r.title) === slug);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }
  
  const Image: FC<ImageProps> = ({src, alt}) => {
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
