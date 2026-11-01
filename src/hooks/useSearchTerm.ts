import { useSearchTermStore } from '@/stores/SearchTerm'

export const useSearchTerm = () => {
  const term = useSearchTermStore((state) => state.term)
  const setTerm = useSearchTermStore((state) => state.setTerm)

  return { term, setTerm }
}
