import React from 'react'
import * as puppyPlaceholders from './assets'

export const PuppyPlaceholder = ({ index = 0, className = '' }) => {
  const PuppyImage = puppyPlaceholders[`puppy${(index % 27) + 1}`];
  return <PuppyImage className={className} />
}
