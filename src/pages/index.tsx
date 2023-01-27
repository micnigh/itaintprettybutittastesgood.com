import {graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { MDXRenderer } from "gatsby-plugin-mdx"
import React from "react"
import { useState } from "react"
import { useEffect } from "react"

import { useStore } from '../layouts'

export const Head = ({ location, params, data, pageContext }) => <>
  <meta name='robots' content='noindex,nofollow' />
  <title>itaintprettybutittastesgood</title>
</>

export const PageHome = ({ data }) => {
  const search = useStore(state => state.search)
  const [recipes, setRecipes] = useState([])
  
  useEffect(() => {
    if (!data.recipes) return;
    if (!search) return setRecipes(data.recipes.nodes)
    setRecipes(data.recipes.nodes.filter(r => new RegExp(`${search}`, 'i').test(r.name) ))
  }, [data.recipes, setRecipes, search])
  
  console.log({ search });
  console.log(data, data.page, data.recipes);
  console.log({ recipes })
  return (
    <main>
      {data.page && <MDXRenderer>{data.page.childMdx.body}</MDXRenderer>}
      {recipes && <>
      {/* <h3>Recipes</h3> */}
      <div sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      }}>
        {recipes.map((r, rI) => (
          <Link to={r.path} key={rI} activeClassName='active' sx={{
            textDecoration: 'none',
            '&:hover,&:active': {
              textDecoration: 'none !important',
              '& > div': {
                bg: 'primary',
                color: 'white',
              }
            }
          }}>
            <GatsbyImage image={getImage(r.cover.image)} title={r.name} alt={r.name} sx={{
              height: '200px',
            }}/>
            <div sx={{
              border: '1px solid black',
              py: 1,
              color: 'black',
              bg: '#f0f0f0',
              fontWeight: 'normal',
              textAlign: 'center',
            }}>
              {r.name}
            </div>
          </Link>
        ))}
      </div>
      </>}
    </main>
  )
}

export default PageHome

export const pageQuery = graphql`
query HomeQuery {
  page: googleDocs(name: {eq: "Home"}) {
    id
    childMdx {
      body
    }
  }
  recipes: allGoogleDocs(filter: { template: {eq: "recipe.tsx" }}) {
		nodes {
			id
      name
      path
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