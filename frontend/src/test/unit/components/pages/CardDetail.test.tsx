import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTCGData } from '@/hooks/useTCGData'
import CardDetail from '@/pages/CardDetail'
import { makeCard } from '@/test/mocks/fixtures/cards'
import { makeTcgResponse } from '@/test/mocks/fixtures/tcg'
import { chooseOption, renderWithClient } from '@/test/utils'
import type { UnifiedCardResponse } from '@/types/proxy'

// O hook é o seam de dados: aqui ele devolve estados prontos (carregando, erro,
// dados). O câmbio (useExchange) continua real, respondido pelo MSW global.
vi.mock('@/hooks/useTCGData', () => ({ useTCGData: vi.fn() }))
const mockUseTCGData = vi.mocked(useTCGData)

// Sem RouterProvider no teste: só o que a página usa do router.
const navigate = vi.hoisted(() => vi.fn())
vi.mock('@tanstack/react-router', () => ({
	Link: ({
		to,
		children,
		...rest
	}: {
		to: string
		children: React.ReactNode
	}) => (
		<a href={to} {...rest}>
			{children}
		</a>
	),
	useParams: () => ({ id: '7' }),
	useSearch: () => ({ setCode: undefined, rarity: undefined }),
	useNavigate: () => navigate,
}))

// O Recharts não mede nada no jsdom; o gráfico em si não é o foco aqui.
vi.mock('@/components/chart/PriceHistoryChart', () => ({
	PriceHistoryChart: () => <div data-testid='price-history-chart' />,
}))

const card = makeCard(7, { name: 'Dark Magician' })

const returnData = (
	data: UnifiedCardResponse,
	extra: Record<string, unknown> = {},
) =>
	mockUseTCGData.mockReturnValue({
		data,
		isLoading: false,
		isError: false,
		isPlaceholderData: false,
		isRefetching: false,
		refetch: vi.fn(),
		...extra,
	} as unknown as ReturnType<typeof useTCGData>)

describe('CardDetail', () => {
	beforeEach(() => {
		mockUseTCGData.mockReset()
		navigate.mockClear()
	})

	describe('carregando', () => {
		it('should render the skeleton instead of a spinner while fetching', () => {
			mockUseTCGData.mockReturnValue({
				data: undefined,
				isLoading: true,
				isError: false,
			} as unknown as ReturnType<typeof useTCGData>)
			renderWithClient(<CardDetail />)

			expect(screen.getByRole('status')).toHaveTextContent(
				'Carregando detalhes da carta...',
			)
			expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
			expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
		})
	})

	describe('erro', () => {
		it('should render the error state with a retry button', async () => {
			const refetch = vi.fn()
			mockUseTCGData.mockReturnValue({
				data: undefined,
				isLoading: false,
				isError: true,
				isRefetching: false,
				refetch,
			} as unknown as ReturnType<typeof useTCGData>)
			renderWithClient(<CardDetail />)

			expect(
				screen.getByText('Não foi possível carregar os dados da carta.'),
			).toBeInTheDocument()

			await userEvent.click(
				screen.getByRole('button', { name: 'Tentar Novamente' }),
			)
			expect(refetch).toHaveBeenCalledTimes(1)
		})

		it('should disable the retry button while retrying', () => {
			mockUseTCGData.mockReturnValue({
				data: undefined,
				isLoading: false,
				isError: true,
				isRefetching: true,
				refetch: vi.fn(),
			} as unknown as ReturnType<typeof useTCGData>)
			renderWithClient(<CardDetail />)

			expect(
				screen.getByRole('button', { name: /Tentando Novamente/ }),
			).toBeDisabled()
		})
	})

	describe('conteúdo', () => {
		it('should show the card name as the page heading', () => {
			returnData(makeTcgResponse(card))
			renderWithClient(<CardDetail />)

			expect(
				screen.getByRole('heading', { level: 1, name: 'Dark Magician' }),
			).toBeInTheDocument()
			expect(screen.getByAltText('Dark Magician')).toBeInTheDocument()
		})

		it('should list the type, race and attribute as tags', () => {
			returnData(makeTcgResponse(card))
			renderWithClient(<CardDetail />)

			const tags = within(
				screen.getByRole('list', { name: 'Classificação' }),
			).getAllByRole('listitem')
			expect(tags.map((tag) => tag.textContent)).toEqual([
				'Normal Monster',
				'Spellcaster',
				'DARK',
			])
		})

		it('should show ATK, DEF and level as stats', () => {
			returnData(makeTcgResponse(card))
			renderWithClient(<CardDetail />)

			// makeCard(7): atk 1000 + 7 * 10, def 1000, level 4
			expect(screen.getByText('ATK').nextElementSibling).toHaveTextContent(
				'1070',
			)
			expect(screen.getByText('DEF').nextElementSibling).toHaveTextContent(
				'1000',
			)
			expect(screen.getByText('Nível').nextElementSibling).toHaveTextContent(
				'4',
			)
		})

		it('should not show stats a Spell or Trap does not have', () => {
			const spell = makeCard(8, {
				name: 'Pot of Greed',
				type: 'Spell Card',
				race: 'Normal',
				attribute: undefined,
				atk: undefined,
				def: undefined,
				level: undefined,
			})
			returnData(makeTcgResponse(spell))
			renderWithClient(<CardDetail />)

			expect(screen.queryByText('ATK')).not.toBeInTheDocument()
			expect(screen.queryByText('DEF')).not.toBeInTheDocument()
			expect(screen.queryByText('Nível')).not.toBeInTheDocument()
		})

		it('should show link rating and arrows instead of DEF and level for a Link monster', () => {
			const response = makeTcgResponse(card)
			returnData({
				...response,
				metadata: {
					...response.metadata,
					type: 'Link Monster',
					def: undefined,
					level: undefined,
					linkval: 2,
					linkmarkers: ['Top', 'Bottom'],
				},
			})
			renderWithClient(<CardDetail />)

			expect(screen.getByText('Link').nextElementSibling).toHaveTextContent('2')
			expect(screen.getByText('Setas').nextElementSibling).toHaveTextContent(
				'↑ ↓',
			)
			expect(screen.queryByText('DEF')).not.toBeInTheDocument()
			expect(screen.queryByText('Nível')).not.toBeInTheDocument()
		})

		it('should show level and scale in the same stat for a Pendulum monster', () => {
			const response = makeTcgResponse(card)
			returnData({
				...response,
				metadata: {
					...response.metadata,
					type: 'Pendulum Effect Monster',
					level: 7,
					scale: 8,
				},
			})
			renderWithClient(<CardDetail />)

			expect(
				screen.getByText('Nível / Escala').nextElementSibling,
			).toHaveTextContent('7 / 8')
		})

		it('should link back to the marketplace', () => {
			returnData(makeTcgResponse(card))
			renderWithClient(<CardDetail />)

			expect(
				screen.getByRole('link', { name: 'Voltar ao mercado' }),
			).toHaveAttribute('href', '/marketplace')
		})
	})

	describe('preço', () => {
		it('should show the latest history price in USD and the BRL equivalent', async () => {
			returnData(makeTcgResponse(card))
			renderWithClient(<CardDetail />)

			const price = screen.getByRole('region', {
				name: 'Último preço (Near Mint)',
			})
			expect(within(price).getByText('$2.50')).toBeInTheDocument()
			// 2,50 × 5,6637 (cotação da fixture)
			expect(
				await within(price).findByText(/≈\s*R\$\s*14,16/),
			).toBeInTheDocument()
		})

		it('should fall back to the lowest price across printings without history', () => {
			returnData(
				makeTcgResponse(card, {
					priceHistory: [],
					priceHistoryStatus: 'not_found',
				}),
			)
			renderWithClient(<CardDetail />)

			const price = screen.getByRole('region', {
				name: 'Preço (menor entre versões)',
			})
			// currentPrice de makeCard(7): 1 + (7 % 10) * 0.75 = 6.25
			expect(within(price).getByText('$6.25')).toBeInTheDocument()
		})

		it('should say "Sem preço" instead of $0.00', () => {
			const base = makeTcgResponse(card, {
				priceHistory: [],
				priceHistoryStatus: 'not_found',
			})
			returnData({
				...base,
				metadata: { ...base.metadata, currentPrice: '0.00' },
			})
			renderWithClient(<CardDetail />)

			expect(screen.getByText('Sem preço')).toBeInTheDocument()
			expect(screen.queryByText('$0.00')).not.toBeInTheDocument()
		})

		it('should show the variation badge for the history period', () => {
			returnData(makeTcgResponse(card))
			renderWithClient(<CardDetail />)

			// fixture: 2,10 → 2,50
			expect(
				screen.getByRole('img', { name: 'Alta de 19,0%' }),
			).toHaveTextContent('+19,0%')
			expect(screen.getByText('no período')).toBeInTheDocument()
		})

		it('should not show a variation without a history', () => {
			returnData(
				makeTcgResponse(card, {
					priceHistory: [],
					priceHistoryStatus: 'not_found',
				}),
			)
			renderWithClient(<CardDetail />)

			expect(screen.queryByText('no período')).not.toBeInTheDocument()
		})

		it('should mark the price panel as busy while switching printing', () => {
			returnData(makeTcgResponse(card), { isPlaceholderData: true })
			renderWithClient(<CardDetail />)

			expect(
				screen.getByRole('region', { name: 'Último preço (Near Mint)' }),
			).toHaveAttribute('aria-busy', 'true')
		})
	})

	describe('histórico', () => {
		it('should render the chart with the period covered', () => {
			returnData(makeTcgResponse(card))
			renderWithClient(<CardDetail />)

			const section = screen.getByRole('region', { name: 'Histórico de preço' })
			expect(
				within(section).getByTestId('price-history-chart'),
			).toBeInTheDocument()
			// 2026-11-07 → 2026-11-13 (fixture)
			expect(section).toHaveTextContent('07/11 – 13/11')
		})

		it('should explain a missing history without treating it as a failure', () => {
			returnData(
				makeTcgResponse(card, {
					priceHistory: [],
					priceHistoryStatus: 'not_found',
				}),
			)
			renderWithClient(<CardDetail />)

			expect(screen.getByRole('status')).toHaveTextContent(
				'Esta impressão ainda não tem histórico de preços.',
			)
			expect(
				screen.queryByTestId('price-history-chart'),
			).not.toBeInTheDocument()
		})

		it('should raise an alert when the price service is down', () => {
			returnData(
				makeTcgResponse(card, {
					priceHistory: [],
					priceHistoryStatus: 'unavailable',
				}),
			)
			renderWithClient(<CardDetail />)

			expect(screen.getByRole('alert')).toHaveTextContent(
				'Serviço de preços indisponível no momento.',
			)
		})
	})

	describe('impressão', () => {
		it('should show the selected printing', () => {
			returnData(makeTcgResponse(card))
			renderWithClient(<CardDetail />)

			expect(
				screen.getByRole('combobox', { name: 'Impressão' }),
			).toHaveTextContent('SD1-EN007 · Common (Starter Deck)')
		})

		it('should hide the selector when the card has no printings', () => {
			returnData(
				makeTcgResponse(card, { printings: [], selectedPrinting: null }),
			)
			renderWithClient(<CardDetail />)

			expect(
				screen.queryByRole('combobox', { name: 'Impressão' }),
			).not.toBeInTheDocument()
		})

		it('should put the chosen printing in the URL without adding a history entry', async () => {
			returnData(makeTcgResponse(card))
			renderWithClient(<CardDetail />)

			await chooseOption(
				userEvent.setup(),
				'Impressão',
				'LC01-EN007 · Ultra Rare (Legendary Collection)',
			)

			expect(navigate).toHaveBeenCalledWith({
				search: { setCode: 'LC01-EN007', rarity: 'Ultra Rare' },
				replace: true,
			})
		})
	})
})
