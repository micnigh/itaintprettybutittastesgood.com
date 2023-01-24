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
      <h3>Recipes</h3>
      <div sx={{
        display: 'grid',
        gap: '10px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
        gridTemplateRows: 'masonry',
      }}>
        {data.recipes.nodes.map((r, rI) => (
          <Link to={r.path} key={rI}>
            <GatsbyImage image={getImage(r.cover.image)} title={r.name} alt={r.name} sx={{
              
            }}/>
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