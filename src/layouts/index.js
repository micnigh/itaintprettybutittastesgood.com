import React from 'react';
import {Button, useColorMode} from "theme-ui"
import {MDXProvider} from "@mdx-js/react"
import {useLocation} from "@reach/router"
import {useEffect, useState} from "react"
import {RiMenuLine, RiMoonLine, RiSunLine} from "react-icons/ri"

import {Details} from "../components/details"
import {GatsbyLogo} from "../components/gatsby-logo"
import {Masonry} from "../components/masonry"
import {Menu} from "../components/menu"
import {Metadata} from '../components/metadata'
import { Link } from '../components/ThemedLink'

/** @jsx jsx */
import {jsx} from "theme-ui"
import { Themed } from '@theme-ui/mdx';

const LayoutIndex = ({children}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [colorMode, setColorMode] = useColorMode()
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "1024px",
        mx: "auto",
        position: 'relative',
      }}
    >
      <header
        sx={{
          color: "black",
          mt: 1,
          mb: 3,
        }}
      >
        <div sx={{
          position: 'relative',
        }}>
          <Link
            to="/"
            sx={{
              textDecoration: "none",
              fontSize: [1, 3, 4],
              textAlign: "center",
            }}
          >
            <Themed.h1 sx={{
              color: 'primary',
            }}>itaintprettybutittastesgood</Themed.h1>
          </Link>
          <span sx={{
            position: 'absolute',
            right: '0px',
            bottom: '0px',
            '& > *': {
              ml: 3,
            }
          }} >
            <Link to='/about' sx={{
              color: 'secondary',
              fontWeight: 'bold',
              textDecoration: 'none',
            }} >About</Link>
          </span>
        </div>
        {process.env.NODE_ENV === 'development' &&
            <Themed.a sx={{
              fontSize: '16px',
              textDecoration: 'none',
              fontWeight: 'bold',
              position: 'absolute',
              top: '0px',
              right: '0px',
              color: '#ccc'
            }} target='_blank' rel='noreferrer' href={`http://localhost:8000/__refresh`} onClick={e => {
              e.preventDefault();
              fetch('http://localhost:8000/__refresh', {
                method: 'POST'
              })
            }}>Refresh</Themed.a>}
      </header>
      <main
        sx={{
          display: "flex",
          flexDirection: "column",
          px: 2,
          bg: "background",
          color: "text",
          position: 'relative',
        }}
      >
        <div
          sx={{
            "& > p": {
              mb: 0,
            },
            "& > * + *:not(h1):not(h2):not(h3)": {
              mt: 2,
            },
            "& > * + h1, & > * + h2, & > * + h3": {
              mt: 3,
            },
            "& > table": {
              width: "100%",
              border: "1px solid",
              borderColor: "grey",
              "& td, & th": {
                p: 1,
                border: "1px solid",
                borderColor: "grey",
              },
            },
            "& a": {
              color: "secondary",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
        >
          <MDXProvider
            components={{
              Button,
              Details,
              GatsbyLogo,
              Masonry,
              Link,
              Metadata,
            }}
          >
            {children}
          </MDXProvider>
        </div>
      </main>
      <footer
        sx={{
          mt: 2,
          mx: "auto",
          color: "black",
          textAlign: "center",
        }}
      >
      </footer>
    </div>
  )
}

export default LayoutIndex
