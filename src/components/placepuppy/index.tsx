import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

type StaticQuery = {
  images: {
    nodes: Queries.File[]
  }
}

export const PuppyPlaceholder = ({ index = 0, className = '' }) => {
  const { images:{ nodes: images } } = useStaticQuery<StaticQuery>(graphql`
    query puppyPower {
      images: allFile (
        filter: {
          sourceInstanceName: {eq: "src"},
          relativePath: {glob: "components/placepuppy/*.jpg"}
        }
        sort: [{relativePath: ASC }, { birthTime: ASC}]
      ) {
        nodes {
          id
          relativePath
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, width: 800)
          }
        }
      }
    }
  `)

  const puppyImage = images[index % (images.length - 1)];
  return <GatsbyImage image={puppyImage.childImageSharp.gatsbyImageData} alt='placeholder' className={className} />
}
