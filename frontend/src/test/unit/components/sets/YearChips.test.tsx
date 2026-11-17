import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import YearChips from '@/components/sets/YearChips'

const years = [2026, 2020, 2002]

describe('YearChips', () => {
	it('should mark "Todos" as pressed when no year is selected', () => {
		render(<YearChips years={years} onChange={vi.fn()} />)

		expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute(
			'aria-pressed',
			'true',
		)
		expect(screen.getByRole('button', { name: '2020' })).toHaveAttribute(
			'aria-pressed',
			'false',
		)
	})

	it('should mark the selected year as pressed', () => {
		render(<YearChips years={years} selected={2020} onChange={vi.fn()} />)

		expect(screen.getByRole('button', { name: '2020' })).toHaveAttribute(
			'aria-pressed',
			'true',
		)
		expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute(
			'aria-pressed',
			'false',
		)
	})

	it('should call onChange with the year, and with undefined for "Todos"', async () => {
		const onChange = vi.fn()
		render(<YearChips years={years} selected={2020} onChange={onChange} />)

		await userEvent.click(screen.getByRole('button', { name: '2002' }))
		await userEvent.click(screen.getByRole('button', { name: 'Todos' }))

		expect(onChange).toHaveBeenNthCalledWith(1, 2002)
		expect(onChange).toHaveBeenNthCalledWith(2, undefined)
	})

	it('should group the chips under an accessible name', () => {
		render(<YearChips years={years} onChange={vi.fn()} />)

		expect(
			screen.getByRole('group', { name: 'Ano de lançamento' }),
		).toBeInTheDocument()
	})
})
