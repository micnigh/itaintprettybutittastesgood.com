import React, { useRef } from "react"
import {graphql, PageProps, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { useState } from "react"
import { useEffect } from "react"
import autoAnimate from '@formkit/auto-animate'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { GiCook, GiCampCookingPot, GiLevelEndFlag } from "react-icons/gi"
import { BiCookie } from "react-icons/bi"

import * as JsSearch from 'js-search'

import { useStore } from '../layouts'
import { PuppyPlaceholder } from "../components/placepuppy"
import { isEditMode } from "./admin"

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

  const getPublishedRecipes = () => isEditMode() ? data.recipes.nodes : data.recipes.nodes.filter(r => process.env.NODE_ENV === 'development' ? true : r.published)

  useEffect(() => {
    if (data.recipes) {
      const nextSearchStore = new JsSearch.Search('id');
      nextSearchStore.addDocuments(getPublishedRecipes())
      nextSearchStore.addIndex('name')
      nextSearchStore.addIndex('tags')
      nextSearchStore.addIndex('date')
      nextSearchStore.addIndex('level')
      setSearchStore(nextSearchStore)
    }
  }, [data.recipes])

  useEffect(() => {
    if (!data.recipes) return;
    if (!search) return setRecipes(getPublishedRecipes())
    setRecipes(searchStore.search(search) as Queries.GoogleDocs[])
  }, [data.recipes, setRecipes, search])

  return (
    <main>
      {<>
      <div ref={recipesRef} sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      }}>
        {recipes.map((r, rI) => {
          return (
          <Link to={r.path} key={rI} sx={{
            variant: 'styles.a',
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            width: '100%',
            height: '300px',
            bg: '#ddd',
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
            {r.cover
            ? <GatsbyImage image={r.cover.image.childImageSharp.gatsbyImageData} title={r.name} alt={r.name} sx={{
              height: '100%',
            }}/>
            : <PuppyPlaceholder index={data.recipes.nodes.findIndex(dr => dr.id === r.id) % 27 + 1} moreSx={{ height: '100%' }} />}
            <div className="label" sx={{
              py: 2,
              color: 'black',
              bg: r.published ? '#f5f5f5' : '#ccc',
              fontWeight: 'normal',
              textAlign: 'center',
              width: '100%',
              // position: 'absolute',
              // bottom: 0,
              // right: 0,
              // left: 0,
              // opacity: .5,
            }}>
              <span sx={{
                fontSize: [3, 2],
              }}>{r.name}{!r.published && <span> - draft</span>}</span>
              <div sx={{
                display: ['grid'],
                gridTemplateColumns: 'repeat(4, minmax(min-content, 1fr))',
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
                {r.servings && <span className="container" title='Servings'>
                  <BiCookie className="icon" /><span className="value">{r.servings}</span>
                </span>}
                {r.cook && <span className="container" title='Cook'>
                  <GiCampCookingPot className="icon" /><span className="value">{r.cook}</span>
                </span>}
                {r.level && <span className="container" title='Level'>
                  <GiLevelEndFlag className="icon" /><span className="value">{r.level}</span>
                </span>}
              </div>
            </div>
          </Link>
          )
        }
      )}
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
    childMarkdownRemark {
      html
    }
  }
  recipes: allGoogleDocs(
    sort: [{
      published: ASC
    }, {
      date: DESC
    }, {
      name: DESC
    }]
    filter: {
      template: {eq: "recipe.tsx"}
    }
  ) {
		nodes {
			id
      published
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
