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
    // Vite serves files from the 'public' directory at the root
    const imagePath = `/recipes/${slug}/${src?.replace('./', '')}`;
    return <img src={imagePath} alt={alt} className="max-w-full h-auto rounded-lg my-4" />;
  }

  return (
    <article className="prose lg:prose-xl">
      <h1>{recipe.title}</h1>
      
      {/* <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul> */}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: Image,
        }}
      >
        {recipe.markdown}
      </ReactMarkdown>
    </article>
  );
};

export default Recipe;
