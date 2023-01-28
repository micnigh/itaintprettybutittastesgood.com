import React from "react"
import {graphql, HeadProps, PageProps} from "gatsby"
import {GatsbyImage, getImage} from "gatsby-plugin-image"
import {MDXRenderer} from "gatsby-plugin-mdx"

export const RecipeTemplate = ({ data }: PageProps<PageData>) => {
  const { page: {id, name, cover, childMdx, date }} = data;
  return (
    <>
      {process.env.NODE_ENV === 'development' && <a sx={{ variant: 'styles.a', ml: 2, position: 'absolute', right: '0px', top: 3, color: '#ccc'}} target='_blank' rel='noreferrer' href={`https://docs.google.com/document/d/${id}/edit`}>Edit</a>}
      <h2 sx={{
        variant: 'styles.h2',
        textAlign: 'left',
        my: 3,
        marginBottom: date ? 0 : undefined,
      }}>{name}</h2>
      {date && <div sx={{ mt: '0px', mb: 3 }}>{new Date(date).toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })}</div>}
      <div sx={{
        textAlign: 'center',
        width: ['100%']
      }}>
        {cover && <GatsbyImage image={getImage(cover.image.childImageSharp.gatsbyImageData)} alt={name} sx={{
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
    </>
  )
}

export default RecipeTemplate

export const Head = (props: HeadProps<PageData>) => {
  return <>
    <meta name='robots' content='noindex,nofollow' />
    <title>itaintprettybutittastesgood - {props.data.page.name}</title>
  </>
}

type PageData = {
  page: Queries.GoogleDocs,
};

export const pageQuery = graphql`
  query Page($path: String!) {
    page: googleDocs(slug: {eq: $path}) {
      id
      name
      date
      tags
      prep
      cook
      servings
      level
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
