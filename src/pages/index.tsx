import {graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { MDXRenderer } from "gatsby-plugin-mdx"
import React from "react"
/** @jsx jsx */
import {jsx} from "theme-ui"

export const PageHome = ({ data }) => {
  console.log(data, data.page, data.recipes);
  return (
    <main>
      {data.page && <MDXRenderer>{data.page.childMdx.body}</MDXRenderer>}
      {data.recipes && <>
      {/* <h3>Recipes</h3> */}
      <div sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      }}>
        {data.recipes.nodes.map((r, rI) => (
          <Link to={r.path} key={rI} sx={{
            textDecoration: 'none',
          }}>
            <GatsbyImage image={getImage(r.cover.image)} title={r.name} alt={r.name} sx={{
              height: '200px',
            }}/>
            <div sx={{
              border: '1px solid black',
              py: 1,
              color: 'black',
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
  recipes: allGoogleDocs(filter: { template: {eq: "recipe" }}) {
		nodes {
			id
      name
      slug
      path
      childMdx {
        body
      }
      cover {
        image {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED)
          }
        }
      }
    }
  }
}
`