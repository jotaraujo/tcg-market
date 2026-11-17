import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SetCombobox from '@/components/sets/SetCombobox'
import { setsFixture } from '@/test/mocks/fixtures/sets'

const sets = setsFixture.filter((set) => set.set_name !== 'Future Booster')

const openList = async (user: ReturnType<typeof userEvent.setup>) =>
	user.click(screen.getByRole('combobox', { name: 'Buscar coleção' }))

describe('SetCombobox', () => {
	it('should open the list and call onSelect with the set name', async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		render(<SetCombobox sets={sets} onSelect={onSelect} />)

		await openList(user)
		await user.click(
			await screen.findByRole('option', { name: /Legendary Collection/ }),
		)

		expect(onSelect).toHaveBeenCalledWith('Legendary Collection')
	})

	it('should find a set by its code', async () => {
		const user = userEvent.setup()
		render(<SetCombobox sets={sets} onSelect={vi.fn()} />)

		await openList(user)
		await user.type(
			await screen.findByPlaceholderText('Nome ou código da coleção'),
			'LC01',
		)

		expect(
			await screen.findByRole('option', { name: /Legendary Collection/ }),
		).toBeInTheDocument()
		expect(
			screen.queryByRole('option', { name: /Starter Deck/ }),
		).not.toBeInTheDocument()
	})

	it('should show the empty message when nothing matches', async () => {
		const user = userEvent.setup()
		render(<SetCombobox sets={sets} onSelect={vi.fn()} />)

		await openList(user)
		await user.type(
			await screen.findByPlaceholderText('Nome ou código da coleção'),
			'zzzz',
		)

		expect(
			await screen.findByText('Nenhuma coleção encontrada.'),
		).toBeInTheDocument()
	})

	it('should show the selected set name on the trigger', () => {
		render(<SetCombobox sets={sets} value={sets[0]} onSelect={vi.fn()} />)

		expect(
			screen.getByRole('combobox', { name: 'Buscar coleção' }),
		).toHaveTextContent(sets[0].set_name)
	})

	it('should invite the search when no set is selected', () => {
		render(<SetCombobox sets={sets} onSelect={vi.fn()} />)

		expect(
			screen.getByRole('combobox', { name: 'Buscar coleção' }),
		).toHaveTextContent('Buscar coleção por nome ou código…')
	})
})
