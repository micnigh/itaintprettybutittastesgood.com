import { create } from 'zustand'

interface StoreState {
  search: string
  setSearch: (search: string) => void
}

export const useStore = create<StoreState>((set) => ({
  search: '',
  setSearch: (search) => set(() => ({ search })),
}))
