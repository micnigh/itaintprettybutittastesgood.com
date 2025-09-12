/// <reference types="@emotion/react" />
import { FC, PropsWithChildren } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { create } from 'zustand';
import { Input, ThemeProvider } from 'theme-ui';
import { Link } from 'react-router-dom';
import { theme } from './theme';
import Home from './pages/Home';
import Recipe from './pages/Recipe';

// This would be in a separate file (e.g., src/pages/admin.ts)
export const isEditMode = () => false;
export const getGithubToken = () => '';

interface StoreState {
  search: string;
  setSearch: (search: string) => void;
}

export const useStore = create<StoreState>(set => ({
  search: '',
  setSearch: (search) => set(() => ({ search })),
}));

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();

  const displaySearch = location.pathname === '/';
  const { search, setSearch } = useStore(state => state);

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
          p: [2, 3],
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
              <h1 sx={{
                variant: 'styles.h1',
                color: 'primary',
                fontSize: [4, 6]
              }}>itaintprettybutittastesgood</h1>
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
          {(isEditMode() || process.env.NODE_ENV === 'development') &&
            <a sx={{
              variant: 'styles.a',
              position: 'absolute',
              top: '-30px',
              right: '0px',
              color: '#ccc'
            }} target='_blank' rel='noreferrer' href={``} title={'refresh data from google drive'} onClick={e => {
              e.preventDefault();
              if (process.env.NODE_ENV === 'development') {
                // This will need to be adapted for Vite's environment
              } else if (isEditMode()) {
                fetch(`https://api.github.com/repos/micnigh/itaintprettybutittastesgood.com/dispatches`, {
                  method: 'POST',
                  headers: {
                    "Accept": "application/vnd.github+json",
                    "Authorization": `Bearer ${getGithubToken()}`,
                  },
                  body: JSON.stringify({"event_type": "build"})
                })
              }
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
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/recipe/:slug" element={<Recipe />} />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    )
}

export default App;
