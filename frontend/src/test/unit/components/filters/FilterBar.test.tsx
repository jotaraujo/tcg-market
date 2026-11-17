import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FilterBar from '@/components/filters/FilterBar'
import { chooseOption } from '@/test/utils'
import type { SelectableFilters } from '@/types/filters'

const setup = (filters: SelectableFilters = {}) => {
	const user = userEvent.setup()
	const onChange = vi.fn()
	render(<FilterBar filters={filters} onChange={onChange} />)
	return { user, onChange }
}

describe('FilterBar', () => {
	it('should render a labelled select for each filter', () => {
		setup()

		for (const name of ['Tipo', 'Atributo', 'Raça', 'Nível', 'Ordenar por']) {
			expect(screen.getByRole('combobox', { name })).toBeInTheDocument()
		}
	})

	it('should show only the filter name when nothing is chosen', () => {
		setup()

		expect(screen.getByRole('combobox', { name: 'Tipo' })).toHaveTextContent(
			/^Tipo$/,
		)
		expect(
			screen.getByRole('combobox', { name: 'Atributo' }),
		).toHaveTextContent(/^Atributo$/)
	})

	it('should reflect the current filters in the pills', () => {
		setup({ type: 'Effect Monster', attribute: 'WATER', level: 4, sort: 'atk' })

		expect(screen.getByRole('combobox', { name: 'Tipo' })).toHaveTextContent(
			'Tipo: Effect Monster',
		)
		expect(
			screen.getByRole('combobox', { name: 'Atributo' }),
		).toHaveTextContent('Atributo: WATER')
		expect(screen.getByRole('combobox', { name: 'Nível' })).toHaveTextContent(
			'Nível: 4',
		)
		expect(
			screen.getByRole('combobox', { name: 'Ordenar por' }),
		).toHaveTextContent('Ordenar: ATK')
	})

	it('should call onChange with the new filter when an option is chosen', async () => {
		const { user, onChange } = setup({ sort: 'atk' })

		await chooseOption(user, 'Atributo', 'WATER')

		expect(onChange).toHaveBeenCalledWith({ attribute: 'WATER', sort: 'atk' })
	})

	it('should send the level as a number', async () => {
		const { user, onChange } = setup()

		await chooseOption(user, 'Nível', '4')

		expect(onChange).toHaveBeenCalledWith({ level: 4 })
	})

	it('should remove the filter when "Todos" is chosen again', async () => {
		const { user, onChange } = setup({ attribute: 'WATER', level: 4 })

		await chooseOption(user, 'Atributo', 'Todos os atributos')

		expect(onChange).toHaveBeenCalledWith({ level: 4 })
	})

	describe('lista de opções', () => {
		it('should mark the current value as selected', async () => {
			const { user } = setup({ attribute: 'WATER' })

			await user.click(screen.getByRole('combobox', { name: 'Atributo' }))

			expect(
				await screen.findByRole('option', { name: 'WATER' }),
			).toHaveAttribute('aria-selected', 'true')
			expect(
				screen.getByRole('option', { name: 'Todos os atributos' }),
			).toHaveAttribute('aria-selected', 'false')
		})

		it('should group the types by Main Deck, Extra Deck and Outros', async () => {
			const { user } = setup()

			await user.click(screen.getByRole('combobox', { name: 'Tipo' }))

			const list = await screen.findByRole('listbox')
			for (const group of ['Main Deck', 'Extra Deck', 'Outros']) {
				expect(within(list).getByText(group)).toBeInTheDocument()
			}
		})

		it('should select the option with the keyboard', async () => {
			const { user, onChange } = setup()

			screen.getByRole('combobox', { name: 'Atributo' }).focus()
			await user.keyboard('{Enter}')
			await user.keyboard('{ArrowDown}{Enter}')

			expect(onChange).toHaveBeenCalledWith({ attribute: 'DARK' })
		})
	})

	describe('Spell e Trap', () => {
		it('should hide attribute and level for a Spell Card type', () => {
			setup({ type: 'Spell Card' })

			expect(
				screen.queryByRole('combobox', { name: 'Atributo' }),
			).not.toBeInTheDocument()
			expect(
				screen.queryByRole('combobox', { name: 'Nível' }),
			).not.toBeInTheDocument()
			expect(screen.getByRole('combobox', { name: 'Tipo' })).toBeEnabled()
		})

		it('should hide attribute and level for a Trap Card type', () => {
			setup({ type: 'Trap Card' })

			expect(
				screen.queryByRole('combobox', { name: 'Atributo' }),
			).not.toBeInTheDocument()
			expect(
				screen.queryByRole('combobox', { name: 'Nível' }),
			).not.toBeInTheDocument()
		})

		it('should only offer spell races for a Spell Card type', async () => {
			const { user } = setup({ type: 'Spell Card' })

			await user.click(screen.getByRole('combobox', { name: 'Raça' }))

			const list = await screen.findByRole('listbox')
			expect(
				within(list).getByRole('option', { name: 'Quick-Play' }),
			).toBeInTheDocument()
			expect(
				within(list).queryByRole('option', { name: 'Dragon' }),
			).not.toBeInTheDocument()
		})

		it('should keep attribute and level available for a monster type', () => {
			setup({ type: 'Effect Monster' })

			expect(screen.getByRole('combobox', { name: 'Atributo' })).toBeEnabled()
			expect(screen.getByRole('combobox', { name: 'Nível' })).toBeEnabled()
		})
	})

	describe('pílulas ativas', () => {
		it('should only offer a remove button for the active filters', () => {
			setup({ type: 'Effect Monster' })

			expect(
				screen.getByRole('button', { name: 'Remover filtro Tipo' }),
			).toBeInTheDocument()
			expect(
				screen.queryByRole('button', { name: 'Remover filtro Atributo' }),
			).not.toBeInTheDocument()
		})

		it('should remove only that filter, keeping the others', async () => {
			const { user, onChange } = setup({
				attribute: 'WATER',
				level: 4,
				sort: 'atk',
			})

			await user.click(
				screen.getByRole('button', { name: 'Remover filtro Atributo' }),
			)

			expect(onChange).toHaveBeenCalledWith({ level: 4, sort: 'atk' })
		})

		it('should not offer a remove button for the sort order', () => {
			setup({ sort: 'atk' })

			expect(
				screen.queryByRole('button', { name: /^Remover filtro/ }),
			).not.toBeInTheDocument()
		})
	})

	describe('limpar filtros', () => {
		it('should not show the clear button when everything is at its default', () => {
			setup()

			expect(
				screen.queryByRole('button', { name: 'Limpar filtros' }),
			).not.toBeInTheDocument()
		})

		it('should not show the clear button when only the sort order was changed', () => {
			setup({ sort: 'atk' })

			expect(
				screen.queryByRole('button', { name: 'Limpar filtros' }),
			).not.toBeInTheDocument()
		})

		it('should clear every filter but keep the sort order', async () => {
			const { user, onChange } = setup({ type: 'Effect Monster', sort: 'atk' })

			await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))

			expect(onChange).toHaveBeenCalledWith({ sort: 'atk' })
		})

		it('should clear to an empty object when there is no sort order', async () => {
			const { user, onChange } = setup({ type: 'Effect Monster' })

			await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))

			expect(onChange).toHaveBeenCalledWith({})
		})
	})
})
