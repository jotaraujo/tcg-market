import { render, screen } from '@testing-library/react'
import CardSkeleton from '@/components/cards/CardSkeleton'

describe('CardSkeleton', () => {
	it('renders four skeleton elements (image, name, set, price)', () => {
		render(<CardSkeleton />)

		expect(screen.getAllByTestId('skeleton')).toHaveLength(4)
	})

	it('renders image skeleton with the same aspect ratio as the card art', () => {
		render(<CardSkeleton />)

		expect(screen.getAllByTestId('skeleton')[0]).toHaveClass('aspect-card')
	})

	it('renders name, set and price skeletons', () => {
		render(<CardSkeleton />)

		const [, name, set, price] = screen.getAllByTestId('skeleton')

		expect(name).toHaveClass('h-4 w-3/4')
		expect(set).toHaveClass('h-3 w-1/2')
		expect(price).toHaveClass('h-3 w-1/3')
	})
})
