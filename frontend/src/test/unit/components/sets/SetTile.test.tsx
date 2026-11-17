import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SetTile from '@/components/sets/SetTile'
import { setsFixture } from '@/test/mocks/fixtures/sets'

const withImage = setsFixture.find((set) => set.set_name === 'Fresh Booster')!
const withoutImage = setsFixture.find(
	(set) => set.set_name === 'Legendary Collection',
)!

describe('SetTile', () => {
	it('should call onSelect with the set name', async () => {
		const onSelect = vi.fn()
		render(<SetTile set={withImage} onSelect={onSelect} />)

		await userEvent.click(screen.getByRole('button', { name: /Fresh Booster/ }))

		expect(onSelect).toHaveBeenCalledWith('Fresh Booster')
	})

	it('should show the code instead of the art when the set has no image', () => {
		const { container } = render(
			<SetTile set={withoutImage} onSelect={vi.fn()} />,
		)

		expect(screen.getByText('LC01')).toBeInTheDocument()
		expect(container.querySelector('img')).toBeNull()
	})

	it('should show the art when the set has an image', () => {
		const { container } = render(<SetTile set={withImage} onSelect={vi.fn()} />)

		expect(container.querySelector('img')).toHaveAttribute(
			'src',
			withImage.set_image,
		)
	})

	it('should show the card count and the release year', () => {
		render(<SetTile set={withImage} onSelect={vi.fn()} />)

		expect(screen.getByText(/100 cartas/)).toBeInTheDocument()
		expect(screen.getByText(/2025/)).toBeInTheDocument()
	})
})
