import {graphql} from "gatsby"
import {GatsbyImage, getImage} from "gatsby-plugin-image"
import {MDXRenderer} from "gatsby-plugin-mdx"
import React from "react"
import {Themed} from "@theme-ui/mdx"
/** @jsx jsx */
import {jsx} from "theme-ui"

const H1 = Themed.h1

const RecipeTemplate = ({
  data: {
    page: {name, cover, childMdx},
  },
}) => {
  return (
    <React.Fragment>
      <H1>{name}</H1>
      {cover && <GatsbyImage image={getImage(cover.image)} />}
      <MDXRenderer>{childMdx.body}</MDXRenderer>
      <div>Recipe Template</div>
    </React.Fragment>
  )
}

export default RecipeTemplate

export const pageQuery = graphql`
  query Page($path: String!) {
    page: googleDocs(slug: {eq: $path}) {
      name
      cover {
        image {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED)
          }
        }
      }
      childMdx {
        body
      }
    }
  }
`
