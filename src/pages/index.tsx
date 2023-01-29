import React, { useRef } from "react"
import {graphql, PageProps, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { useState } from "react"
import { useEffect } from "react"
import autoAnimate from '@formkit/auto-animate'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { GiCook, GiCampCookingPot, GiLevelEndFlag } from "react-icons/gi"
import { BiCookie } from "react-icons/bi"

import * as JsSearch from 'js-search'

import { useStore } from '../layouts'

export const PageHome = ({ data }: PageProps<PageData>) => {
  const [searchStore, setSearchStore] = useState<JsSearch.Search>(null)
  const search = useStore(state => state.search)
  const [recipes, setRecipes] = useState<Queries.GoogleDocs[]>([])

  const breakpointIndex = useBreakpointIndex()

  const recipesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // enable in/out animation on larger devices
    breakpointIndex > 0 && recipesRef.current && autoAnimate(recipesRef.current, {
      duration: 250,
    })
  }, [recipesRef, breakpointIndex])

  useEffect(() => {
    if (data.recipes) {
      const nextSearchStore = new JsSearch.Search('id');
      nextSearchStore.addDocuments(data.recipes.nodes)
      nextSearchStore.addIndex('name')
      nextSearchStore.addIndex('tags')
      nextSearchStore.addIndex('date')
      nextSearchStore.addIndex('level')
      setSearchStore(nextSearchStore)
    }
  }, [data.recipes])

  useEffect(() => {
    if (!data.recipes) return;
    if (!search) return setRecipes(data.recipes.nodes)
    setRecipes(searchStore.search(search) as Queries.GoogleDocs[])
  }, [data.recipes, setRecipes, search])

  return (
    <main>
      {data.page && <MDXRenderer>{data.page.childMdx.body}</MDXRenderer>}
      {recipes && <>
      <div ref={recipesRef} sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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
              height: '250px',
            }}/>
            <div className="label" sx={{
              py: 2,
              color: 'black',
              bg: '#f5f5f5',
              fontWeight: 'normal',
              textAlign: 'center',
            }}>
              <span sx={{
                fontSize: [3, 2],
              }}>{r.name}</span>
              {r.tags &&
              <div sx={{
                display: 'block',
                flexGrow: 1,
                whiteSpace: 'normal',
                ml: 2,
                mt: 1,
                fontSize: [2, 1],
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
              <div sx={{
                display: ['grid'],
                gridTemplateColumns: 'repeat(4, minmax(50px, 1fr))',
                gap: 1,
                alignItems: 'center',
                justifyItems: 'center',
                overflow: 'hidden',
                fontSize: 1,
                mt: 1,
                '.icon': {
                  mr: '4px',
                },
                '.container': {
                  whiteSpace: 'nowrap',
                },
              }}>
                {r.prep && <span className="container" title='Prep'>
                  <GiCook className="icon" /><span className="value">{r.prep}</span>
                </span>}
                {r.cook && <span className="container" title='Cook'>
                  <GiCampCookingPot className="icon" /><span className="value">{r.cook}</span>
                </span>}
                {r.servings && <span className="container" title='Servings'>
                  <BiCookie className="icon" /><span className="value">{r.servings}</span>
                </span>}
                {r.level && <span className="container" title='Level'>
                  <GiLevelEndFlag className="icon" /><span className="value">{r.level}</span>
                </span>}
              </div>
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
