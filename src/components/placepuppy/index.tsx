import React from 'react'
import { ThemeUIStyleObject } from 'theme-ui'
import * as puppyPlaceholders from './assets'

export const PuppyPlaceholder = ({ index = 0, moreSx = {} }) =>
  <div title={'placeholder'} sx={{
    display: 'inline-block',
    width: '100%',
    height: '250px',
    bg: '#ddd',
    position: 'relative',
    overflow: 'hidden',
    verticalAlign: 'top',
    ...moreSx,
  }}>
    <img src={puppyPlaceholders[`puppy${(index % 27) + 1}`]} sx={{
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }} />
  </div>
