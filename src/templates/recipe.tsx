import React from "react"
import {graphql, HeadProps, PageProps} from "gatsby"
import {GatsbyImage, getImage} from "gatsby-plugin-image"
import {MDXRenderer} from "gatsby-plugin-mdx"

import { GiCook, GiCampCookingPot, GiLevelEndFlag } from "react-icons/gi"
import { BiCookie } from "react-icons/bi"

export const RecipeTemplate = ({ data }: PageProps<PageData>) => {
  const { page: {id, name, cover, childMdx, date, cook, level, prep, servings }} = data;
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
          width: [null, null, '325px', '450px'],
          height: [null, null, '325px', '450px'],
          maxHeight: ['300px', '400px', '450px'],
          float: [null, null, 'right'],
          ml: [null, null, 2],
          borderRadius: '10%',
        }}  />}
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
        <span className="container">
          <GiCook className="icon" /><span className="value">Prep: {prep}</span>
        </span>
        <span className="container">
          <GiCampCookingPot className="icon" /><span className="value">Cook: {cook}</span>
        </span>
        <span className="container">
          <BiCookie className="icon" /><span className="value">Servings: {servings}</span>
        </span>
        <span className="container">
          <GiLevelEndFlag className="icon" /><span className="value">Level: {level}</span>
        </span>
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
