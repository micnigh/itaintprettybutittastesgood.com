import { FC } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import recipes from '../recipes.json';
import { slugify } from '../utils';
import PlacePuppy from '../components/placepuppy';

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
    if (!src) {
      return <PlacePuppy width={800} height={600} className="max-w-full h-auto rounded-lg my-4" />;
    }
    // Vite serves files from the 'public' directory at the root
    const imagePath = `/recipes/${slug}/${src?.replace('./', '')}`;
    return <img src={imagePath} alt={alt} className="max-w-full h-auto rounded-lg my-4" />;
  }

  return (
    <>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center my-4 sm:my-6">{recipe.title}</h1>
      <article className="prose lg:prose-xl max-w-none prose-img:rounded-xl">
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
