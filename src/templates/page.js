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
      {process.env.NODE_ENV === 'development' && <Themed.a sx={{ fontSize: '16px', textDecoration: 'none', ml: 2, position: 'absolute', right: '0px', color: '#ccc !important' }} target='_blank' rel='noreferrer' href={`https://docs.google.com/document/d/${data.page.id}/edit`}>Edit</Themed.a>}
      <MDXRenderer sx={{ position: 'relative' }}>{data.page.childMdx.body}</MDXRenderer>
    </React.Fragment>
  )
}

export const pageQuery = graphql`
  query Page($path: String!) {
    page: googleDocs(slug: {eq: $path}) {
      id
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
