import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SetHeader from '@/components/sets/SetHeader'
import { setsFixture } from '@/test/mocks/fixtures/sets'

const set = setsFixture.find((s) => s.set_name === 'Legendary Collection')!

describe('SetHeader', () => {
	it('should show name, card count and year', () => {
		render(<SetHeader set={set} onClear={vi.fn()} />)

		expect(
			screen.getByRole('heading', { name: 'Legendary Collection' }),
		).toBeInTheDocument()
		expect(screen.getByText(/45 cartas/)).toBeInTheDocument()
		expect(screen.getByText(/2013/)).toBeInTheDocument()
	})

	it('should call onClear from "Trocar coleção"', async () => {
		const onClear = vi.fn()
		render(<SetHeader set={set} onClear={onClear} />)

		await userEvent.click(
			screen.getByRole('button', { name: 'Trocar coleção' }),
		)

		expect(onClear).toHaveBeenCalledTimes(1)
	})
})
