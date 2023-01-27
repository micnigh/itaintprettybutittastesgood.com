import React from 'react';
import { Button, useColorMode } from "theme-ui"
import { MDXProvider } from "@mdx-js/react"
import { useLocation } from "@reach/router"
import { useEffect, useState } from "react"
import { RiMenuLine, RiMoonLine, RiSunLine } from "react-icons/ri"

import { Details } from "../components/details"
import { GatsbyLogo } from "../components/gatsby-logo"
import { Masonry } from "../components/masonry"
import { Menu } from "../components/menu"
import { Metadata } from '../components/metadata'
import { Link } from '../components/ThemedLink'
import { create } from 'zustand'

import { Themed } from '@theme-ui/mdx';
import { Input } from 'theme-ui';

interface StoreState {
  search: string;
  setSearch: (search: string) => void;
}

export const useStore = create<StoreState>(set => ({
  search: '',
  setSearch: (search: string) => set(() => ({ search }))
}))

const LayoutIndex: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [colorMode, setColorMode] = useColorMode()
  const location = useLocation()

  const displaySearch = location.pathname === '/'
  const { search, setSearch } = useStore(state => state)

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
          display: 'grid',
          position: 'relative',
          gridTemplateColumns: [null, null, displaySearch ? 'min-content min-content 1fr' : null, '1fr min-content 1fr'],
          alignItems: 'center'
        }}
      >
        <span sx={{ flexGrow: 1 }} />
        <div>
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
        </div>
        <div sx={{ flexGrow: 1, textAlign: 'right' }}>
          {displaySearch &&
            <Input type='text' placeholder='filter'
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{
                display: 'inline-block',
                width: [null, null, 'calc(100% - 60px)'],
                py: 1,
                px: 1,
                mt: [1, 1, 0],
                ml: [null, null, 1],
              }}
            />}
        </div>
        <span sx={{
          position: 'absolute',
          right: '0px',
          bottom: 1,
          '& > *': {
            ml: 3,
          }
        }} >
        </span>
        {process.env.NODE_ENV === 'development' &&
          <Themed.a sx={{
            fontSize: '16px',
            textDecoration: 'none',
            fontWeight: 'bold',
            position: 'absolute',
            top: '-30px',
            right: '0px',
            color: '#ccc'
          }} target='_blank' rel='noreferrer' href={`http://localhost:8000/__refresh`} title={'refresh data from google drive'} onClick={e => {
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
