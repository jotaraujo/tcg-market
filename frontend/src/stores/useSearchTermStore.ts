import { create } from 'zustand'

interface SearchTermState {
  term: string
  setTerm: (term: string) => void
}

export const useSearchTermStore = create<SearchTermState>((set) => ({
  term: '',
  setTerm: (term) => set({ term }),
}))