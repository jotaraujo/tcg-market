import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FilterBar from '@/components/filters/FilterBar'
import type { SelectableFilters } from '@/types/filters'

const setup = (filters: SelectableFilters = {}) => {
	const onChange = vi.fn()
	render(<FilterBar filters={filters} onChange={onChange} />)
	return { onChange }
}

describe('FilterBar', () => {
	it('should render a labelled select for each filter', () => {
		setup()

		for (const name of ['Tipo', 'Atributo', 'Raça', 'Nível', 'Ordenar por']) {
			expect(screen.getByRole('combobox', { name })).toBeInTheDocument()
		}
	})

	it('should start with "Todos" selected in the filters', () => {
		setup()

		expect(screen.getByRole('combobox', { name: 'Tipo' })).toHaveValue('')
		expect(screen.getByRole('combobox', { name: 'Atributo' })).toHaveValue('')
	})

	it('should reflect the current filters in the selects', () => {
		setup({ type: 'Effect Monster', attribute: 'WATER', level: 4, sort: 'atk' })

		expect(screen.getByRole('combobox', { name: 'Tipo' })).toHaveValue(
			'Effect Monster',
		)
		expect(screen.getByRole('combobox', { name: 'Atributo' })).toHaveValue(
			'WATER',
		)
		expect(screen.getByRole('combobox', { name: 'Nível' })).toHaveValue('4')
		expect(screen.getByRole('combobox', { name: 'Ordenar por' })).toHaveValue(
			'atk',
		)
	})

	it('should call onChange with the new filter when an option is chosen', async () => {
		const { onChange } = setup({ sort: 'atk' })

		await userEvent.selectOptions(
			screen.getByRole('combobox', { name: 'Atributo' }),
			'WATER',
		)

		expect(onChange).toHaveBeenCalledWith({ attribute: 'WATER', sort: 'atk' })
	})

	it('should send the level as a number', async () => {
		const { onChange } = setup()

		await userEvent.selectOptions(
			screen.getByRole('combobox', { name: 'Nível' }),
			'4',
		)

		expect(onChange).toHaveBeenCalledWith({ level: 4 })
	})

	it('should remove the filter when "Todos" is chosen again', async () => {
		const { onChange } = setup({ attribute: 'WATER', level: 4 })

		await userEvent.selectOptions(
			screen.getByRole('combobox', { name: 'Atributo' }),
			'',
		)

		expect(onChange).toHaveBeenCalledWith({ level: 4 })
	})

	describe('Spell e Trap', () => {
		it('should disable attribute and level for a Spell Card type', () => {
			setup({ type: 'Spell Card' })

			expect(screen.getByRole('combobox', { name: 'Atributo' })).toBeDisabled()
			expect(screen.getByRole('combobox', { name: 'Nível' })).toBeDisabled()
			expect(screen.getByRole('combobox', { name: 'Tipo' })).toBeEnabled()
		})

		it('should only offer spell races for a Spell Card type', () => {
			setup({ type: 'Spell Card' })

			const race = screen.getByRole('combobox', { name: 'Raça' })
			expect(
				within(race).getByRole('option', { name: 'Quick-Play' }),
			).toBeInTheDocument()
			expect(
				within(race).queryByRole('option', { name: 'Dragon' }),
			).not.toBeInTheDocument()
		})

		it('should keep attribute and level enabled for a monster type', () => {
			setup({ type: 'Effect Monster' })

			expect(screen.getByRole('combobox', { name: 'Atributo' })).toBeEnabled()
			expect(screen.getByRole('combobox', { name: 'Nível' })).toBeEnabled()
		})
	})

	describe('limpar filtros', () => {
		it('should not show the clear button when everything is at its default', () => {
			setup()

			expect(
				screen.queryByRole('button', { name: 'Limpar filtros' }),
			).not.toBeInTheDocument()
		})

		it('should show the clear button when only the sort order was changed', () => {
			setup({ sort: 'atk' })

			expect(
				screen.getByRole('button', { name: 'Limpar filtros' }),
			).toBeInTheDocument()
		})

		it('should clear every filter, including the sort order', async () => {
			const { onChange } = setup({ type: 'Effect Monster', sort: 'atk' })

			await userEvent.click(
				screen.getByRole('button', { name: 'Limpar filtros' }),
			)

			expect(onChange).toHaveBeenCalledWith({})
		})
	})

	describe('painel no mobile', () => {
		it('should toggle the panel with an accessible button', async () => {
			setup()

			const toggle = screen.getByRole('button', { name: /^Filtros/ })
			expect(toggle).toHaveAttribute('aria-expanded', 'false')

			await userEvent.click(toggle)
			expect(toggle).toHaveAttribute('aria-expanded', 'true')

			await userEvent.click(toggle)
			expect(toggle).toHaveAttribute('aria-expanded', 'false')
		})

		it('should show how many filters are active on the toggle button', () => {
			setup({ type: 'Effect Monster', level: 4, sort: 'atk' })

			expect(
				screen.getByRole('button', { name: 'Filtros, 2 ativos' }),
			).toBeInTheDocument()
		})

		it('should not show a count when no filter is active', () => {
			setup({ sort: 'atk' })

			expect(
				screen.getByRole('button', { name: 'Filtros' }),
			).toBeInTheDocument()
		})
	})
})
