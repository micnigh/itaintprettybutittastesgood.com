import React from "react"
import {graphql, PageProps, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { useState } from "react"
import { useEffect } from "react"

import { useStore } from '../layouts'

export const PageHome = ({ data }: PageProps<PageData>) => {
  const search = useStore(state => state.search)
  const [recipes, setRecipes] = useState<Queries.GoogleDocs[]>([])

  useEffect(() => {
    if (!data.recipes) return;
    if (!search) return setRecipes(data.recipes.nodes)
    setRecipes(data.recipes.nodes.filter(r => {
      const matcher = new RegExp(`${search}`, 'i');
      return matcher.test(r.name) || (r.tags && r.tags.some(t => matcher.test(t)))
    }))
  }, [data.recipes, setRecipes, search])

  return (
    <main>
      {data.page && <MDXRenderer>{data.page.childMdx.body}</MDXRenderer>}
      {recipes && <>
      <div sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      }}>
        {recipes.map((r, rI) => (
          <Link to={r.path} key={rI} sx={{
            variant: 'styles.a',
            '&:hover,&:active': {
              '.label': {
                bg: 'primary',
                color: 'white',
              },
              '.tag': {
                bg: 'secondary',
              }
            }
          }}>
            <GatsbyImage image={getImage(r.cover.image.childImageSharp.gatsbyImageData)} title={r.name} alt={r.name} sx={{
              height: '200px',
            }}/>
            <div className="label" sx={{
              py: 2,
              color: 'black',
              bg: '#f5f5f5',
              fontWeight: 'normal',
              textAlign: 'center',
            }}>
              <span>{r.name}</span>
              {r.tags &&
              <div sx={{
                display: 'block',
                flexGrow: 1,
                whiteSpace: 'normal',
                ml: 2,
                mt: 1,
                fontSize: [0, 1],
                textAlign: 'left',
                '.tag': {
                  bg: '#ccc',
                  color: 'white',
                  borderRadius: '10px',
                  py: '2px',
                  px: '8px',
                  mr: '4px',
                  mb: '4px',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                },
              }}>
                {r.tags && r.tags.map(t => <span key={t} className='tag' sx={{

                }}>
                  {t}
                </span>)}
              </div>}
            </div>
          </Link>
        ))}
      </div>
      </>}
    </main>
  )
}

export default PageHome

export const Head = () => {
  return <>
    <meta name='robots' content='noindex,nofollow' />
    <title>itaintprettybutittastesgood</title>
  </>
}

type PageData = {
  page: Queries.GoogleDocs,
  recipes: { nodes: Queries.GoogleDocs[] },
}

export const pageQuery = graphql`
query HomeQuery {
  page: googleDocs(name: {eq: "Home"}) {
    id
    childMdx {
      body
    }
  }
  recipes: allGoogleDocs(sort:{ order: DESC, fields: date }, filter: { template: {eq: "recipe.tsx" }}) {
		nodes {
			id
      name
      path
      date
      tags
      prep
      cook
      servings
      level
      cover {
        image {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, width: 600)
          }
        }
      }
    }
  }
}
`
