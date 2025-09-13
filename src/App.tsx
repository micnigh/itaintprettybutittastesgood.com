import { FC, PropsWithChildren } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { create } from 'zustand';
import { Link } from 'react-router-dom';
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

  const headerGridClass = displaySearch 
    ? "lg:grid-cols-[min-content_min-content_1fr]" 
    : "lg:grid-cols-[1fr_min-content_1fr]";

  return (
    <div className="bg-body-bg">
      <div className="flex flex-col w-full max-w-5xl mx-auto relative min-h-screen p-4 sm:p-6 bg-white shadow-lg text-text">
        <header className={`text-black mt-4 mb-6 grid relative items-center ${headerGridClass}`}>
          <span className="flex-grow" />
          <div>
            <Link to="/" className="text-3xl text-center no-underline">
              <h1 className="font-bold text-primary">itaintprettybutittastesgood</h1>
            </Link>
          </div>
          <div className="flex-grow text-right">
            {displaySearch &&
              <input type='text' placeholder='filter'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="inline-block lg:w-[calc(100%-60px)] py-1 px-2 mt-1 lg:mt-0 lg:ml-2 border rounded-md"
              />}
          </div>
        </header>
        <main className="flex flex-col relative">
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
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipe/:slug" element={<Recipe />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App;
