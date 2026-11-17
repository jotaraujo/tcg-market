import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MarketplacePage from '@/pages/MarketplacePage'
import { useSearchTermStore } from '@/stores/useSearchTermStore'
import { server } from '@/test/mocks/server'
import { renderWithClient } from '@/test/utils'

// O jsdom não tem IntersectionObserver e a paginação não é o foco aqui.
vi.mock('@/hooks/useIntersectionObserver', () => ({
	useIntersectionObserver: vi.fn(() => vi.fn()),
}))

// Mesmo mock do Link usado no CardGrid.test: evita montar um RouterProvider.
vi.mock('@tanstack/react-router', () => ({
	Link: ({ to, params, children }: any) => (
		<a href={params ? to.replace('$id', params.id) : to}>{children}</a>
	),
}))

const CARDINFO_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'

// Guarda a query string de cada chamada ao YGOPRODECK, na ordem. Sem `body`,
// cai no handler padrão (caminho feliz com as fixtures).
const recordRequests = () => {
	const searches: URLSearchParams[] = []
	server.use(
		http.get(CARDINFO_URL, ({ request }) => {
			searches.push(new URL(request.url).searchParams)
			return HttpResponse.json({ data: [] })
		}),
	)
	return searches
}

const lastSearch = (searches: URLSearchParams[]) => searches.at(-1)

describe('MarketplacePage', () => {
	beforeEach(() => {
		useSearchTermStore.setState({ term: '' })
	})

	it('should render the filter bar above the grid', async () => {
		renderWithClient(<MarketplacePage />)

		expect(screen.getByRole('combobox', { name: 'Tipo' })).toBeInTheDocument()
		expect(await screen.findByText('Carta de Teste 1')).toBeInTheDocument()
	})

	it('should send the chosen filters to the API', async () => {
		const searches = recordRequests()
		renderWithClient(<MarketplacePage />)
		await waitFor(() => expect(searches.length).toBeGreaterThan(0))

		await userEvent.selectOptions(
			screen.getByRole('combobox', { name: 'Atributo' }),
			'WATER',
		)

		await waitFor(() =>
			expect(lastSearch(searches)?.get('attribute')).toBe('WATER'),
		)
		// a paginação continua valendo junto com os filtros
		expect(lastSearch(searches)?.get('offset')).toBe('0')
	})

	it('should combine the filters with the search term', async () => {
		useSearchTermStore.setState({ term: 'dark' })
		const searches = recordRequests()
		renderWithClient(<MarketplacePage />)

		await userEvent.selectOptions(
			screen.getByRole('combobox', { name: 'Nível' }),
			'4',
		)

		await waitFor(() => {
			const search = lastSearch(searches)
			expect(search?.get('fname')).toBe('dark')
			expect(search?.get('level')).toBe('4')
		})
	})

	it('should show the empty state, not the error, when the filters match no card', async () => {
		server.use(
			http.get(CARDINFO_URL, ({ request }) => {
				const params = new URL(request.url).searchParams
				if (params.get('attribute') === 'WATER') {
					return HttpResponse.json(
						{ error: 'No card matching your query was found in the database.' },
						{ status: 400 },
					)
				}
				return HttpResponse.json({ data: [] })
			}),
		)
		renderWithClient(<MarketplacePage />)

		await userEvent.selectOptions(
			screen.getByRole('combobox', { name: 'Atributo' }),
			'WATER',
		)

		expect(
			await screen.findByText('Nenhuma carta encontrada.'),
		).toBeInTheDocument()
		expect(screen.queryByText('Tentar Novamente')).not.toBeInTheDocument()
	})

	it('should reset the filters and reuse the cached unfiltered list when cleared', async () => {
		const searches = recordRequests()
		renderWithClient(<MarketplacePage />)
		await waitFor(() => expect(searches.length).toBe(1))

		await userEvent.selectOptions(
			screen.getByRole('combobox', { name: 'Atributo' }),
			'WATER',
		)
		await waitFor(() => expect(searches.length).toBe(2))

		await userEvent.click(
			screen.getByRole('button', { name: 'Limpar filtros' }),
		)

		expect(screen.getByRole('combobox', { name: 'Atributo' })).toHaveValue('')
		// A consulta sem filtros já está no cache (staleTime de 1 dia): voltar a
		// ela não faz uma nova requisição.
		await new Promise((resolve) => setTimeout(resolve, 100))
		expect(searches).toHaveLength(2)
	})
})
