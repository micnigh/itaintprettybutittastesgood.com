import { FC } from 'react'
import puppy1 from './assets/01.jpg'
import puppy2 from './assets/02.jpg'
import puppy3 from './assets/03.jpg'
import puppy4 from './assets/04.jpg'
import puppy5 from './assets/05.jpg'
import puppy6 from './assets/06.jpg'
import puppy7 from './assets/07.jpg'
import puppy8 from './assets/08.jpg'
import puppy9 from './assets/09.jpg'
import puppy10 from './assets/10.jpg'
import puppy11 from './assets/11.jpg'
import puppy12 from './assets/12.jpg'
import puppy13 from './assets/13.jpg'
import puppy14 from './assets/14.jpg'
import puppy15 from './assets/15.jpg'
import puppy16 from './assets/16.jpg'
import puppy17 from './assets/17.jpg'
import puppy18 from './assets/18.jpg'
import puppy19 from './assets/19.jpg'
import puppy20 from './assets/20.jpg'
import puppy21 from './assets/21.jpg'
import puppy22 from './assets/22.jpg'
import puppy23 from './assets/23.jpg'
import puppy24 from './assets/24.jpg'
import puppy25 from './assets/25.jpg'
import puppy26 from './assets/26.jpg'
import puppy27 from './assets/27.jpg'
import puppy28 from './assets/28.jpg'

interface PlacePuppyProps {
  width?: number
  height?: number
  className?: string
  alt?: string
  index?: number
}

const puppyImages = [
  puppy1,
  puppy2,
  puppy3,
  puppy4,
  puppy5,
  puppy6,
  puppy7,
  puppy8,
  puppy9,
  puppy10,
  puppy11,
  puppy12,
  puppy13,
  puppy14,
  puppy15,
  puppy16,
  puppy17,
  puppy18,
  puppy19,
  puppy20,
  puppy21,
  puppy22,
  puppy23,
  puppy24,
  puppy25,
  puppy26,
  puppy27,
  puppy28,
]

const getPuppyByIndex = (index: number) => {
  return puppyImages[index % puppyImages.length]
}

const PlacePuppy: FC<PlacePuppyProps> = ({
  width = 200,
  height = 150,
  className = '',
  alt = 'A cute puppy',
  index = 0,
}) => {
  const puppyUrl = getPuppyByIndex(index)

  return (
    <img
      src={puppyUrl}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  )
}

export default PlacePuppy
