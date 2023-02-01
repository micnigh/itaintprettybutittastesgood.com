import React from 'react'
import * as puppyPlaceholders from './assets'

export const PuppyPlaceholder = ({ index = 0, moreSx = {} }) => {
  const PuppyImage = puppyPlaceholders[`puppy${(index % 27) + 1}`];
  return <PuppyImage moreSx={moreSx} />
}
