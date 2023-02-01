import React from 'react'
import * as puppyPlaceholders from './assets'

export const PuppyPlaceholder = ({ index = 0, ...props }) => {
  const PuppyImage = puppyPlaceholders[`puppy${(index % 27) + 1}`];
  return <PuppyImage {...props} />
}
