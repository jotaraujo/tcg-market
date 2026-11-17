import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import CardGrid from '@/components/cards/CardGrid'
import { useCards } from '@/hooks/useCards'
import { makeCard } from '@/test/mocks/fixtures/cards'
import { exchangeFixture } from '@/test/mocks/fixtures/exchange'
import { server } from '@/test/mocks/server'
import { renderWithClient } from '@/test/utils'
import type { CardFilters } from '@/types/filters'

// 1. Mocks de Hooks
// useCards continua mockado: aqui o foco é o CardGrid reagindo ao câmbio.
// O useExchange NÃO é mockado: roda de verdade e o fetch cai no MSW.
vi.mock('@/hooks/useCards', () => ({
	useCards: vi.fn(),
}))

vi.mock('@/hooks/useIntersectionObserver', () => ({
	useIntersectionObserver: vi.fn(() => ({
		ref: vi.fn(),
	})),
}))

// 2. Mock do Link para evitar dependência do RouterProvider
vi.mock('@tanstack/react-router', () => ({
	Link: ({ to, params, children }: any) => {
		const href = params ? to.replace('$id', params.id) : to
		return (
			<a href={href} data-testid='card-link'>
				{children}
			</a>
		)
	},
}))

// 3. Dados: carta de US$ 10,00 (com a taxa da fixture, 5.6637 → R$ 56,64)
const mockCard = makeCard(123, {
	name: 'Dark Magician',
	card_prices: [
		{
			tcgplayer_price: '10.00',
			ebay_price: '0.00',
			amazon_price: '0.00',
			coolstuffinc_price: '0.00',
		},
	],
})

const EXCHANGE_URL = 'https://api.frankfurter.dev/v1/latest'

// Estado "padrão" de useCards: pronto, sem erro, sem próxima página.
// Cada teste sobrescreve só o que importa.
const mockUseCards = (overrides: Record<string, unknown> = {}) => {
	vi.mocked(useCards).mockReturnValue({
		data: { pages: [{ data: [mockCard] }] },
		isLoading: false,
		isError: false,
		error: null,
		refetch: vi.fn(),
		isFetching: false,
		fetchNextPage: vi.fn(),
		hasNextPage: false,
		isFetchingNextPage: false,
		...overrides,
	} as unknown as ReturnType<typeof useCards>)
}

describe('CardGrid', () => {
	// Filtros genéricos para testes — type assertion para evitar erros de literal union
	const defaultFilters = {
		search: '',
		type: 'all',
		attribute: 'all',
	} as unknown as Omit<CardFilters, 'num' | 'offset'>

	it('should show loading skeletons when isLoading is true', () => {
		mockUseCards({ data: undefined, isLoading: true })

		renderWithClient(<CardGrid filters={defaultFilters} />)

		// Os skeletons aparecem já no primeiro render (nada assíncrono aqui)
		expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
	})

	it('should show error state when isError is true', async () => {
		mockUseCards({
			data: undefined,
			isError: true,
			error: { message: 'Erro de API' },
		})

		renderWithClient(<CardGrid filters={defaultFilters} />)

		// O grid segura o skeleton até o câmbio terminar, então o erro
		// só aparece depois da resposta do MSW → findBy espera, getBy não
		expect(await screen.findByText('Erro de API')).toBeInTheDocument()
	})

	it('should show empty message when no cards are found', async () => {
		mockUseCards({ data: { pages: [{ data: [] }] } })

		renderWithClient(<CardGrid filters={defaultFilters} />)

		expect(
			await screen.findByText('Nenhuma carta encontrada.'),
		).toBeInTheDocument()
		// o estado vazio sugere o que fazer
		expect(screen.getByText(/Tente outro nome/)).toBeInTheDocument()
	})

	it('should render the cards as a list so screen readers announce the count', async () => {
		mockUseCards()

		renderWithClient(<CardGrid filters={defaultFilters} />)

		expect(await screen.findByRole('list')).toBeInTheDocument()
		expect(screen.getAllByRole('listitem')).toHaveLength(1)
	})

	it('should load only the first cards eagerly and the rest lazily', async () => {
		const many = Array.from({ length: 8 }, (_, i) => makeCard(i + 1))
		mockUseCards({ data: { pages: [{ data: many }] } })

		const { container } = renderWithClient(
			<CardGrid filters={defaultFilters} />,
		)
		await screen.findByRole('list')

		const imgs = [...container.querySelectorAll('img')]
		expect(imgs).toHaveLength(8)
		expect(
			imgs.slice(0, 6).every((i) => i.getAttribute('loading') === 'eager'),
		).toBe(true)
		expect(
			imgs.slice(6).every((i) => i.getAttribute('loading') === 'lazy'),
		).toBe(true)
	})

	it('should show skeletons and announce it while the next page loads', async () => {
		mockUseCards({ hasNextPage: true, isFetchingNextPage: true })

		renderWithClient(<CardGrid filters={defaultFilters} />)

		await screen.findByRole('list')
		expect(screen.getByRole('status')).toHaveTextContent(
			'Carregando mais cartas…',
		)
		expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
	})

	it('should show the end-of-list message when there are no more pages', async () => {
		mockUseCards({ hasNextPage: false })

		renderWithClient(<CardGrid filters={defaultFilters} />)

		await screen.findByRole('list')
		expect(screen.getByRole('status')).toHaveTextContent(
			'Fim da lista · 1 cartas',
		)
	})

	it('should render cards and their links when data is available', async () => {
		mockUseCards()

		renderWithClient(<CardGrid filters={defaultFilters} />)

		expect(await screen.findByText('Dark Magician')).toBeInTheDocument()

		// Verifica se existe um link com href="/card/123"
		const link = screen.getByTestId('card-link')
		expect(link).toHaveAttribute('href', '/card/123')
	})

	describe('câmbio USD → R$', () => {
		it('should hold the skeleton until the exchange rate arrives', async () => {
			// Segura a resposta do câmbio até chamarmos release()
			let release!: () => void
			const gate = new Promise<void>((resolve) => {
				release = resolve
			})
			server.use(
				http.get(EXCHANGE_URL, async () => {
					await gate
					return HttpResponse.json(exchangeFixture)
				}),
			)
			mockUseCards()

			renderWithClient(<CardGrid filters={defaultFilters} />)

			// Câmbio pendente: skeleton na tela e nenhuma carta ainda
			expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
			expect(screen.queryByText('Dark Magician')).not.toBeInTheDocument()

			release()

			expect(await screen.findByText('Dark Magician')).toBeInTheDocument()
			expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
		})

		it('should show the price in BRL when the rate is available', async () => {
			mockUseCards()

			renderWithClient(<CardGrid filters={defaultFilters} />)

			// 10 * 5.6637 = 56.637 → "R$ 56,64". O Intl usa espaço não separável
			// entre "R$" e o número, por isso a regex em vez do texto exato.
			expect(await screen.findByText(/R\$\s*56,64/)).toBeInTheDocument()
		})

		it('should fall back to USD when the exchange API fails', async () => {
			// fetchUsdBrlRate loga o erro; silencia só neste teste
			const consoleError = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})
			server.use(
				http.get(EXCHANGE_URL, () =>
					HttpResponse.json({ error: 'indisponível' }, { status: 500 }),
				),
			)
			mockUseCards()

			renderWithClient(<CardGrid filters={defaultFilters} />)

			// O useExchange tem retry: 2 (1s + 2s de backoff), e isso vale mais do
			// que o retry: false do QueryClient de teste. Por isso o timeout longo.
			expect(
				await screen.findByText('$10.00', {}, { timeout: 5000 }),
			).toBeInTheDocument()
			expect(screen.queryByText(/R\$/)).not.toBeInTheDocument()

			consoleError.mockRestore()
		}, 10000)
	})
})
