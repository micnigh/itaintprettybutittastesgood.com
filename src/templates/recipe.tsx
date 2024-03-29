import React from "react"
import moment from 'moment'
import {graphql, HeadProps, PageProps} from "gatsby"
import {GatsbyImage, getImage} from "gatsby-plugin-image"

import { GiCook, GiCampCookingPot, GiLevelEndFlag } from "react-icons/gi"
import { BiCookie } from "react-icons/bi"
import { PuppyPlaceholder } from "../components/placepuppy"
import { isEditMode } from "../pages/admin"

export const RecipeTemplate = ({ data }: PageProps<PageData>) => {
  const { page: {id, name, childMarkdownRemark: { html }, cover, date, cook, level, prep, servings, tags, published }, recipes } = data;
  return (
    <>
      {(isEditMode() || process.env.NODE_ENV === 'development') && <a sx={{ variant: 'styles.a', ml: 2, position: 'absolute', right: '0px', top: 3, color: '#ccc'}} target='_blank' rel='noreferrer' href={`https://docs.google.com/document/d/${id}/edit`}>Edit</a>}
      <div sx={{
        display: 'flex',
        my: 3,
        alignItems: ['left', null, 'center'],
        flexDirection: ['column', null, 'row']
      }}>
        <span sx={{}}>
          <h2 sx={{
            variant: 'styles.h2',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            marginBottom: date ? 0 : undefined,
          }}>{name}</h2>
          {date && <div sx={{ mt: '0px' }}>{moment.utc(date).format('MMM D, YYYY')}{!published && <span> - draft</span>}</div>}
        </span>
        {tags &&
        <div sx={{
          display: 'block',
          flexGrow: 1,
          whiteSpace: 'normal',
          ml: 2,
          mt: [3, null, 0],
          fontSize: [1, 2],
          '.tag': {
            bg: 'secondary',
            color: 'white',
            borderRadius: '10px',
            py: '2px',
            px: '8px',
            mr: [1, 2],
            mb: [1, 1, 0],
            whiteSpace: 'nowrap',
            display: 'inline-block',
          }
        }}>
          {tags && tags.map(t => <span key={t} className='tag' sx={{

          }}>
            {t}
          </span>)}
        </div>}
      </div>
      <div sx={{
        textAlign: 'center',
        width: ['100%']
      }}>
        {cover && cover.image && <GatsbyImage image={getImage(cover.image.childImageSharp.gatsbyImageData)} alt={name} sx={{
          width: [null, null, '325px', '450px'],
          height: [null, null, '325px', '450px'],
          maxHeight: ['300px', '400px', '450px'],
          float: [null, null, 'right'],
          ml: [null, null, 2],
          borderRadius: '10%',
        }}  />}
        {(!cover || !cover.image) && <PuppyPlaceholder index={recipes.nodes.findIndex(r => r.id === data.page.id)} sx={{
          width: ['100%', '100%', '325px', '450px'],
          height: ['300px', '300px', '325px', '450px'],
          maxHeight: ['300px', '400px', '450px'],
          float: [null, null, 'right'],
          ml: [null, null, 2],
          borderRadius: '10%', }} />}
      </div>
      <div sx={{
        display: ['grid', null, 'inline-grid'],
        gridTemplateColumns: ['repeat(2, minmax(min-content, 1fr))', null, 'repeat(2, minmax(min-content, 1fr))', 'repeat(2, minmax(min-content, 1fr)))'],
        gap: [1, null, null, 1],
        alignItems: 'center',
        justifyItems: 'left',
        fontSize: [null, null, null, 2],
        mt: [2, null, 0],
        '.icon': {
          mr: '4px',
        },
        '.container': {
          whiteSpace: 'nowrap',
        },
      }}>
        {prep && <span className="container">
          <GiCook className="icon" /><span className="value">Prep: {prep}</span>
        </span>}
        {servings && <span className="container">
          <BiCookie className="icon" /><span className="value">Servings: {servings}</span>
        </span>}
        {cook && <span className="container">
          <GiCampCookingPot className="icon" /><span className="value">Cook: {cook}</span>
        </span>}
        {level && <span className="container">
          <GiLevelEndFlag className="icon" /><span className="value">Level: {level}</span>
        </span>}
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
        <div dangerouslySetInnerHTML={{ __html: html }}/>
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
  recipes: { nodes: Queries.GoogleDocs[] },
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
      level
      servings
      published
      childMarkdownRemark {
        html
      }
      cover {
        image {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, width: 800)
          }
        }
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
      }
    }
  }
`
