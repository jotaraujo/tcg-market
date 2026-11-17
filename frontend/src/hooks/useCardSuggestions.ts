import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ONE_DAY_MS, ONE_WEEK_MS } from '@/constants/time'
import { fetchCards } from '@/lib/api/ygoprodeck'
import { rankSuggestions } from '@/lib/rankSuggestions'

// Abaixo disso o termo casa com milhares de cartas e a sugestão não ajuda.
export const MIN_SUGGESTION_CHARS = 2
export const MAX_SUGGESTIONS = 8
// Busca mais do que mostra: a API ordena por nome e `fname` casa em qualquer
// parte, então os que começam com o termo podem estar além dos 8 primeiros.
const FETCH_SIZE = 30

// Sugestões de carta para o autocomplete do SearchBar. Vai direto à
// YGOPRODECK (sem quota, como a listagem) e nunca toca a JustTCG.
export const useCardSuggestions = (term: string) => {
	const trimmed = term.trim()

	return useQuery({
		queryKey: ['card-suggestions', trimmed.toLowerCase()],
		queryFn: async () => {
			const { data } = await fetchCards({
				fname: trimmed,
				num: FETCH_SIZE,
				offset: 0,
			})
			return rankSuggestions(data, trimmed, MAX_SUGGESTIONS)
		},
		enabled: trimmed.length >= MIN_SUGGESTION_CHARS,
		// Mesmo cache longo da listagem: repetir um prefixo não refaz a requisição
		staleTime: ONE_DAY_MS,
		gcTime: ONE_WEEK_MS,
		// Mantém a lista anterior na tela enquanto a próxima carrega (sem piscar)
		placeholderData: keepPreviousData,
		// Sugestão é opcional: se falhar, o dropdown só não aparece
		retry: false,
	})
}
