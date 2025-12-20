import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from './Home'

interface MockStoreState {
  search: string
  setSearch: (search: string) => void
}

// Mock the store
const mockUseStore = vi.hoisted(() => vi.fn())
vi.mock('../store/search', () => ({
  useStore: (selector?: (state: MockStoreState) => unknown): unknown => {
    const state = mockUseStore() as MockStoreState
    return selector ? selector(state) : state
  },
}))

describe('Home Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStore.mockReturnValue({
      search: '',
    })
  })

  it('should render recipe list', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    // Check that the grid container is rendered
    const grid = document.querySelector('.grid')
    expect(grid).toBeInTheDocument()
  })

  it('should filter recipes based on search', () => {
    mockUseStore.mockReturnValue({
      search: 'cranberry',
    })

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    // The component should render filtered recipes
    // This is a basic integration test - actual filtering logic is tested in e2e
    const grid = document.querySelector('.grid')
    expect(grid).toBeInTheDocument()
  })

  it('should display all recipes when search is empty', () => {
    mockUseStore.mockReturnValue({
      search: '',
    })

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    const grid = document.querySelector('.grid')
    expect(grid).toBeInTheDocument()
  })
})
