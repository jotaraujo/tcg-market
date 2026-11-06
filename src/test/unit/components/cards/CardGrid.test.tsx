import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CardGrid from '@/components/cards/CardGrid'
import type { Card, CardMidia } from '@/types/card'
import type { CardFilters } from '@/types/filters'

// 1. Mocks de Hooks
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

// 3. Mock de Dados (Card & CardMidia para cobrir card_images)
const mockCard: Card & CardMidia = {
	id: 123,
	name: 'Dark Magician',
	fname: 'Dark Magician',
	type: 'Normal Monster',
	race: 'Spellcaster',
	attribute: 'DARK',
	atk: 2500,
	def: 2100,
	level: 7,
	archetype: 'Dark Magician',
	typeline: ['Spellcaster', 'Normal'],
	humanReadableCardType: 'Normal Monster',
	frameType: 'normal',
	card_prices: [],
	card_sets: [
		{
			set_name: 'Starter Deck',
			set_code: 'SD1',
			set_rarity: 'Ultra Rare',
			set_rarity_code: '(UR)',
			set_price: '10.00',
		},
	],
	card_images: [
		{
			id: 123,
			image_url: 'https://example.com/card.jpg',
			image_url_small: 'https://example.com/card_small.jpg',
			image_url_cropped: 'https://example.com/card_cropped.jpg',
		},
	],
	ygoprodeck_url: 'https://ygoprodeck.com/card/?id=123',
}

import { useCards } from '@/hooks/useCards'

describe('CardGrid', () => {
	// Filtros genéricos para testes — type assertion para evitar erros de literal union
	const defaultFilters = {
		search: '',
		type: 'all',
		attribute: 'all',
	} as unknown as Omit<CardFilters, 'num' | 'offset'>

	it('should show loading skeletons when isLoading is true', () => {
		vi.mocked(useCards).mockReturnValue({
			data: undefined,
			isLoading: true,
			isError: false,
			error: null,
			refetch: vi.fn(),
			isFetching: false,
			fetchNextPage: vi.fn(),
			hasNextPage: false,
			isFetchingNextPage: false,
		} as any)

		render(<CardGrid filters={defaultFilters} />)

		// Verifica se os skeletons de loading estão na tela
		const skeletons = screen.getAllByRole('generic')
		expect(skeletons.length).toBeGreaterThan(0)
	})

	it('should show error state when isError is true', () => {
		vi.mocked(useCards).mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
			error: { message: 'Erro de API' },
			refetch: vi.fn(),
			isFetching: false,
			fetchNextPage: vi.fn(),
			hasNextPage: false,
			isFetchingNextPage: false,
		} as any)

		render(<CardGrid filters={defaultFilters} />)

		// Verifica se a mensagem de erro aparece
		expect(screen.getByText('Erro de API')).toBeInTheDocument()
	})

	it('should show empty message when no cards are found', () => {
		vi.mocked(useCards).mockReturnValue({
			data: { pages: [{ data: [] }] },
			isLoading: false,
			isError: false,
			error: null,
			refetch: vi.fn(),
			isFetching: false,
			fetchNextPage: vi.fn(),
			hasNextPage: false,
			isFetchingNextPage: false,
		} as any)

		render(<CardGrid filters={defaultFilters} />)

		// Verifica texto "Nenhuma carta encontrada"
		expect(screen.getByText('Nenhuma carta encontrada.')).toBeInTheDocument()
	})

	it('should render cards and their links when data is available', () => {
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
		} as any)

		render(<CardGrid filters={defaultFilters} />)

		// Verifica se o nome 'Dark Magician' está na tela
		expect(screen.getByText('Dark Magician')).toBeInTheDocument()

		// Verifica se existe um link com href="/card/123"
		const link = screen.getByTestId('card-link')
		expect(link).toHaveAttribute('href', '/card/123')
	})
})