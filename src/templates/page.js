import {graphql, useStaticQuery} from "gatsby"
import {MDXRenderer} from "gatsby-plugin-mdx"
import React from "react"
import {Themed} from "@theme-ui/mdx"
/** @jsx jsx */
import {jsx} from "theme-ui"

export const PageTemplate = ({
  data,
}) => {
  return (
    <React.Fragment>
      <MDXRenderer>{data.page.childMdx.body}</MDXRenderer>
    </React.Fragment>
  )
}

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

export default PageTemplate;
