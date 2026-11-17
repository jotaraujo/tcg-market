import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PriceVariationBadge } from '@/components/chart/PriceVariationBadge'

describe('PriceVariationBadge', () => {
	it('should show a rise with sign, comma and a spoken label', () => {
		render(
			<PriceVariationBadge variation={{ percent: 18.6, direction: 'up' }} />,
		)

		const badge = screen.getByRole('img', { name: 'Alta de 18,6%' })
		expect(badge).toHaveTextContent('+18,6%')
	})

	it('should show a drop with the minus sign and a spoken label', () => {
		render(
			<PriceVariationBadge variation={{ percent: -4.2, direction: 'down' }} />,
		)

		const badge = screen.getByRole('img', { name: 'Queda de 4,2%' })
		expect(badge).toHaveTextContent('-4,2%')
	})

	it('should show no sign and a neutral label when nothing changed', () => {
		render(
			<PriceVariationBadge variation={{ percent: 0, direction: 'flat' }} />,
		)

		const badge = screen.getByRole('img', { name: 'Sem variação' })
		expect(badge).toHaveTextContent('0,0%')
		expect(badge).not.toHaveTextContent('+')
	})

	it('should not rely on color alone: the icon is part of the badge', () => {
		render(<PriceVariationBadge variation={{ percent: 5, direction: 'up' }} />)

		expect(screen.getByRole('img').querySelector('svg')).toBeInTheDocument()
	})
})
