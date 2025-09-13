import { FC } from 'react';
import { Link } from 'react-router-dom';
import recipes from '../recipes.json';
import { slugify } from '../utils';
import PlacePuppy from '../components/placepuppy';

const getImageUrlFromMarkdown = (markdown: string): string | null => {
  const match = /!\[.*?\]\((.*?)\)/.exec(markdown);
  return match ? match[1] : null;
};

const Home: FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {recipes.map((recipe, index) => {
        const imageUrl = getImageUrlFromMarkdown(recipe.markdown);
        const slug = slugify(recipe.title);

        return (
          <div key={recipe.id} className="text-center">
            <Link to={`/recipe/${slug}`}>
              {imageUrl ? (
                <img 
                  src={`/recipes/${slug}/${imageUrl.replace('./', '')}`} 
                  alt={recipe.title} 
                  className="w-full h-48 object-cover rounded-lg shadow-md" 
                />
              ) : (
                <PlacePuppy width={200} height={150} className="w-full h-48 object-cover rounded-lg shadow-md" index={index} />
              )}
            </Link>
            <Link to={`/recipe/${slug}`} className="text-lg text-text hover:underline mt-2 inline-block">{recipe.title}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
