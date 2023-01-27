import {graphql} from "gatsby"
import {GatsbyImage, getImage} from "gatsby-plugin-image"
import {MDXRenderer} from "gatsby-plugin-mdx"
import React from "react"
import {Themed} from "@theme-ui/mdx"

export const Head = ({ location, params, data, pageContext }) =>
  <>
    <meta name='robots' content='noindex,nofollow' />
    <title>itaintprettybutittastesgood - {data.page.name}</title>
  </>

export const RecipeTemplate = ({ data }) => {
  const { page: {id, name, cover, childMdx}} = data;
  return (
    <React.Fragment>
      {process.env.NODE_ENV === 'development' && <Themed.a sx={{ fontSize: '16px', textDecoration: 'none', ml: 2, position: 'absolute', right: '0px', top: 3, color: '#ccc !important'}} target='_blank' rel='noreferrer' href={`https://docs.google.com/document/d/${id}/edit`}>Edit</Themed.a>}
      <Themed.h2 sx={{
        textAlign: 'left',
        my: 3,
      }}>{name}</Themed.h2>
      <div sx={{
        textAlign: 'center',
        width: ['100%']
      }}>
        {cover && <GatsbyImage image={getImage(cover.image)} alt={name} sx={{
          // float: 'left',
          width: ['100%'],
          float: [null, null, 'right'],
          maxHeight: ['500px'],
          maxWidth: ['100%', null, '500px'],
          m: [null, null, 2],
          borderRadius: '5%',
        }}  />}
      </div>
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
