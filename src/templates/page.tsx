import React from "react"
import {graphql, HeadProps, PageProps} from "gatsby"
import { isEditMode } from "../pages/admin"

export const PageTemplate = ({
  data,
}: PageProps<PageData>) => {
  return (
    <>
      {(isEditMode() || process.env.NODE_ENV === 'development') && <a sx={{ variant: 'styles.a', ml: 2, position: 'absolute', right: '0px', color: '#ccc' }} target='_blank' rel='noreferrer' href={`https://docs.google.com/document/d/${data.page.id}/edit`}>Edit</a>}
      <div sx={{ position: 'relative' }} dangerouslySetInnerHTML={{ __html: data.page.childMarkdownRemark.html }} />
    </>
  )
}

export const Head = (props: HeadProps<PageData>) => {
  return <>
    <meta name='robots' content='noindex,nofollow' />
    <title>itaintprettybutittastesgood - {props.data.page.name}</title>
  </>
}

type PageData = {
  page: Queries.GoogleDocs;
}

export const pageQuery = graphql`
  query Page($path: String!) {
    page: googleDocs(slug: {eq: $path}) {
      id
      name
      cover {
        image {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED)
          }
        }
      }
      childMarkdownRemark {
        html
      }
    }
  }
`

export default PageTemplate;
