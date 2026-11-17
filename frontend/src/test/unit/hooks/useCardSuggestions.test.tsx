import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { useCardSuggestions } from '@/hooks/useCardSuggestions'
import { makeCard } from '@/test/mocks/fixtures/cards'
import { server } from '@/test/mocks/server'

const CARDINFO_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'

const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider
		client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
	>
		{children}
	</QueryClientProvider>
)

// Guarda a query string de cada chamada e responde com as cartas dadas
const respondWith = (cards: ReturnType<typeof makeCard>[]) => {
	const searches: URLSearchParams[] = []
	server.use(
		http.get(CARDINFO_URL, ({ request }) => {
			searches.push(new URL(request.url).searchParams)
			return HttpResponse.json({ data: cards })
		}),
	)
	return searches
}

describe('useCardSuggestions', () => {
	it('should not fetch with fewer than 2 characters', async () => {
		const searches = respondWith([])
		const { result } = renderHook(() => useCardSuggestions('d'), { wrapper })

		await new Promise((resolve) => setTimeout(resolve, 50))

		expect(result.current.fetchStatus).toBe('idle')
		expect(searches).toHaveLength(0)
	})

	it('should not fetch for a term that is only spaces', async () => {
		const searches = respondWith([])
		renderHook(() => useCardSuggestions('   '), { wrapper })

		await new Promise((resolve) => setTimeout(resolve, 50))

		expect(searches).toHaveLength(0)
	})

	it('should search by name with the trimmed term', async () => {
		const searches = respondWith([makeCard(1, { name: 'Dark Magician' })])
		const { result } = renderHook(() => useCardSuggestions(' dark '), {
			wrapper,
		})

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(searches).toHaveLength(1)
		expect(searches[0].get('fname')).toBe('dark')
		expect(searches[0].get('offset')).toBe('0')
	})

	it('should return at most 8 suggestions', async () => {
		respondWith(
			Array.from({ length: 30 }, (_, i) =>
				makeCard(i + 1, { name: `Dark ${i}` }),
			),
		)
		const { result } = renderHook(() => useCardSuggestions('dark'), { wrapper })

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(result.current.data).toHaveLength(8)
	})

	it('should rank the names that start with the term first', async () => {
		respondWith([
			makeCard(1, { name: 'A Dark Hole' }),
			makeCard(2, { name: 'Dark Magician' }),
		])
		const { result } = renderHook(() => useCardSuggestions('dark'), { wrapper })

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(result.current.data?.[0].name).toBe('Dark Magician')
	})

	it('should return an empty list when no card matches', async () => {
		server.use(
			http.get(CARDINFO_URL, () =>
				HttpResponse.json(
					{ error: 'No card matching your query was found in the database.' },
					{ status: 400 },
				),
			),
		)
		const { result } = renderHook(() => useCardSuggestions('zzzz'), { wrapper })

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(result.current.data).toEqual([])
	})

	it('should fail quietly (no retry) when the API is down', async () => {
		server.use(http.get(CARDINFO_URL, () => HttpResponse.error()))
		const { result } = renderHook(() => useCardSuggestions('dark'), { wrapper })

		await waitFor(() => expect(result.current.isError).toBe(true))

		expect(result.current.data).toBeUndefined()
	})
})
