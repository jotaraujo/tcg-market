import { useSearchTermStore } from '@/stores/useSearchTermStore'

export const useSearchTerm = () => {
  const term = useSearchTermStore((state) => state.term)
  const setTerm = useSearchTermStore((state) => state.setTerm)

  return { term, setTerm }
}
