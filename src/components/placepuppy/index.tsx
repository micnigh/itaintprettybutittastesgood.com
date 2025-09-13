import { FC } from 'react';

interface PlacePuppyProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

const PlacePuppy: FC<PlacePuppyProps> = ({ width = 200, height = 150, className = '', alt = 'A cute puppy' }) => {
  const puppyUrl = `https://place-puppy.com/${width}x${height}`;
  
  return (
    <img 
      src={puppyUrl} 
      alt={alt} 
      className={className} 
    />
  );
};

export default PlacePuppy;
