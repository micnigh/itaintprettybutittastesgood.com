import { FC } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import recipes from '../recipes.json';
import { slugify } from '../utils';
import PlacePuppy from '../components/placepuppy';
import type { Recipe } from '../../scripts/fetch-data';
import { format } from 'date-fns';


interface ImageProps {
  src?: string;
  alt?: string;
}

const Recipe: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const recipe = (recipes as Recipe[]).find(r => slugify(r.title) === slug);
  const recipeIndex = recipes.findIndex(r => slugify(r.title) === slug);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const Image: FC<ImageProps> = ({ src, alt }) => {
    if (!src) {
      if (recipe.heroImage) {
        const imagePath = `/recipes/${slug}/${recipe.heroImage}`;
        return <img src={imagePath} alt={alt || recipe.title} className="max-w-full h-auto rounded-lg my-4" />;
      }
      return <PlacePuppy width={800} height={600} className="max-w-full h-auto rounded-lg my-4" index={recipeIndex} />;
    }
    // Vite serves files from the 'public' directory at the root
    const imagePath = `/recipes/${slug}/${src?.replace('./', '')}`;
    return <img src={imagePath} alt={alt} className="max-w-full h-auto rounded-lg my-4" />;
  }

  return (
    <>
      <div className="flex flex-row items-center">
        <span><h1 className="text-3xl font-bold mt-4 sm:mt-6 mr-4">{recipe.title}</h1>
          {recipe.metadata?.date && <div className="text-sm text-gray-500 mb-4">{format(new Date(recipe.metadata?.date || ''), 'MMM d, yyyy')}</div>}
        </span>
        <span>
          {recipe.metadata?.tags?.map((tag) => (
            <span className="bg-blue-400 text-white rounded-full px-2 py-1 text-sm mr-4">{tag}</span>
          ))}
        </span>
      </div>
      <ul className="flex flex-row gap-4 mb-2">
        {recipe.metadata?.level && <li>Level: {recipe.metadata?.level}</li>}
        {recipe.metadata?.prep && <li>Prep: {recipe.metadata?.prep}</li>}
        {recipe.metadata?.cook && <li>Cook: {recipe.metadata?.cook}</li>}
        {recipe.metadata?.servings && <li>Servings: {recipe.metadata?.servings}</li>}
      </ul>
      <article className="prose max-w-none prose-img:rounded-xl">
        {recipe.heroImage ? <img src={`/recipes/${slug}/${recipe.heroImage}`} alt={recipe.title} className="h-auto rounded-lg inline-block float-right max-w-[500px] max-h-[500px] ml-8 my-8" /> : <PlacePuppy width={800} height={600} className="h-auto rounded-lg inline-block float-right max-w-[500px] max-h-[500px] ml-8 my-8" index={recipeIndex} />}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: Image,
          }}
        >
          {recipe.markdown}
        </ReactMarkdown>
        
      </article>
    </>
  );
};

export default Recipe;
