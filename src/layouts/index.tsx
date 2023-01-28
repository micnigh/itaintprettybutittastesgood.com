import React from 'react';
import { MDXProvider } from "@mdx-js/react"
import { useLocation } from "@reach/router"

import { create } from 'zustand'

import { Themed } from '@theme-ui/mdx';
import { Input } from 'theme-ui';
import { Link } from 'gatsby';

interface StoreState {
  search: string;
  setSearch: (search: string) => void;
}

export const useStore = create<StoreState>(set => ({
  search: '',
  setSearch: (search: string) => set(() => ({ search }))
}))

const LayoutIndex: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation()

  const displaySearch = location.pathname === '/'
  const { search, setSearch } = useStore(state => state)

  return (
    <div sx={{
      bg: 'background',
    }}>
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "1024px",
          mx: "auto",
          position: 'relative',
          minHeight: "100vh",
          p: 3,
          bg: 'white',
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
                variant: 'styles.a',
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
          {process.env.NODE_ENV === 'development' &&
            <a sx={{
              variant: 'styles.a',
              position: 'absolute',
              top: '-30px',
              right: '0px',
              color: '#ccc'
            }} target='_blank' rel='noreferrer' href={`http://localhost:8000/__refresh`} title={'refresh data from google drive'} onClick={e => {
              e.preventDefault();
              fetch('http://localhost:8000/__refresh', {
                method: 'POST'
              })
            }}>Refresh</a>}
        </header>
        <main
          sx={{
            display: "flex",
            flexDirection: "column",
            color: "text",
            position: 'relative',
          }}
        >
          <div>
            <MDXProvider>
              {children}
            </MDXProvider>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LayoutIndex
