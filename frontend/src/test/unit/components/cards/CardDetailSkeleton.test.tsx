import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CardDetailSkeleton from '@/components/cards/CardDetailSkeleton'

describe('CardDetailSkeleton', () => {
	it('should announce the loading to assistive tech', () => {
		render(<CardDetailSkeleton />)

		const status = screen.getByRole('status')
		expect(status).toHaveAttribute('aria-busy', 'true')
		expect(status).toHaveTextContent('Carregando detalhes da carta...')
	})

	it('should draw placeholders for the art, texts, price and chart', () => {
		render(<CardDetailSkeleton />)

		// arte + chips + nome + tiles + preço + impressão + gráfico: bem mais que um bloco
		expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(15)
	})

	it('should reserve the exact chart height to avoid layout shift', () => {
		render(<CardDetailSkeleton />)

		const chart = screen
			.getAllByTestId('skeleton')
			.find((element) => element.style.height === '300px')
		expect(chart).toBeDefined()
	})

	it('should not render any real content (no heading, no price)', () => {
		render(<CardDetailSkeleton />)

		expect(screen.queryByRole('heading')).not.toBeInTheDocument()
		expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
	})
})
