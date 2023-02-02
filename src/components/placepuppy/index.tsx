import React from 'react'
import * as puppyPlaceholders from './assets'

export const puppyCount = Object.keys(puppyPlaceholders).length

export const PuppyPlaceholder = ({ index = 0, className = '' }) => {
  const PuppyImage = puppyPlaceholders[`puppy${(index % puppyCount - 1) + 1}`];
  return <PuppyImage className={className} />
}
