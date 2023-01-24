import {graphql, useStaticQuery} from "gatsby"
import {GatsbyImage, getImage} from "gatsby-plugin-image"
import {MDXRenderer} from "gatsby-plugin-mdx"
import React from "react"
import {Themed} from "@theme-ui/mdx"
/** @jsx jsx */
import {jsx} from "theme-ui"

export const RecipeTemplate = ({ data }) => {
  const { page: {id, name, cover, childMdx}} = data;
  return (
    <React.Fragment>
      <Themed.h2 sx={{
        textAlign: 'left',
        my: 3,
      }}>{name}{process.env.NODE_ENV === 'development' && <a sx={{ fontSize: '16px', textDecoration: 'none', ml: 2 }} target='_blank' rel='noreferrer' href={`https://docs.google.com/document/d/${id}/edit`}>Edit</a>}</Themed.h2>
      {cover && <GatsbyImage image={getImage(cover.image)} alt={name} sx={{
        // float: 'left',
        float: 'right',
        height: '500px',
      }}  />}
      <div sx={{
        fontSize: 2,
        'h1, h2, h3, h4, h5': {
          mt: 2,
        },
        'p': {
          mb: 2,
        }
      }}>
        <MDXRenderer>{childMdx.body}</MDXRenderer>
      </div>
    </React.Fragment>
  )
}

export default RecipeTemplate

export const pageQuery = graphql`
  query Page($path: String!) {
    page: googleDocs(slug: {eq: $path}) {
      name
      id
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
