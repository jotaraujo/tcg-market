import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import YearSelect from '@/components/sets/YearSelect'
import { chooseOption } from '@/test/utils'

const years = [2026, 2020, 2002]

describe('YearSelect', () => {
	it('should say "Todos os anos" when no year is selected', () => {
		render(<YearSelect years={years} onChange={vi.fn()} />)

		expect(
			screen.getByRole('combobox', { name: 'Ano de lançamento' }),
		).toHaveTextContent('Todos os anos')
	})

	it('should show the selected year', () => {
		render(<YearSelect years={years} selected={2020} onChange={vi.fn()} />)

		expect(
			screen.getByRole('combobox', { name: 'Ano de lançamento' }),
		).toHaveTextContent('2020')
	})

	it('should list "Todos os anos" and every year', async () => {
		const user = userEvent.setup()
		render(<YearSelect years={years} onChange={vi.fn()} />)

		await user.click(
			screen.getByRole('combobox', { name: 'Ano de lançamento' }),
		)

		expect(
			(await screen.findAllByRole('option')).map((o) => o.textContent),
		).toEqual(['Todos os anos', '2026', '2020', '2002'])
	})

	it('should call onChange with the year, and with undefined for "Todos os anos"', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		render(<YearSelect years={years} selected={2020} onChange={onChange} />)

		await chooseOption(user, 'Ano de lançamento', '2002')
		await chooseOption(user, 'Ano de lançamento', 'Todos os anos')

		expect(onChange).toHaveBeenNthCalledWith(1, 2002)
		expect(onChange).toHaveBeenNthCalledWith(2, undefined)
	})
})
