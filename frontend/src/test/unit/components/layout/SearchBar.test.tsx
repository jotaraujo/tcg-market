import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { useSearchTermStore } from '#/stores/useSearchTermStore'
import SearchBar from '@/components/layout/SearchBar'
import { server } from '@/test/mocks/server'
import { renderWithClient } from '@/test/utils'

// O SearchBar navega para a carta escolhida; sem RouterProvider no teste,
// só o `navigate` interessa.
const navigate = vi.hoisted(() => vi.fn())
vi.mock('@tanstack/react-router', () => ({
	useNavigate: () => navigate,
}))

const CARDINFO_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'

describe('SearchBar', () => {
	beforeEach(() => {
		useSearchTermStore.setState({ term: '' })
		navigate.mockClear()
	})

	// ---------------------------------------------------
	// DEBOUNCE DO FILTRO (relógio falso)
	// ---------------------------------------------------
	describe('filtro do grid', () => {
		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('updates the search store with debounce of 300ms', () => {
			renderWithClient(<SearchBar />)

			const input = screen.getByPlaceholderText(/Buscar cartas/i)
			fireEvent.change(input, { target: { value: 'Blue-Eyes' } })

			// Antes do debounce (300ms) o store ainda deve estar vazio.
			expect(useSearchTermStore.getState().term).toBe('')

			act(() => {
				vi.advanceTimersByTime(300)
			})

			expect(useSearchTermStore.getState().term).toBe('Blue-Eyes')
		})
	})

	// ---------------------------------------------------
	// AUTOCOMPLETE (relógio real: o debounce e o MSW são assíncronos de verdade)
	// ---------------------------------------------------
	describe('sugestões', () => {
		// Digita e espera a lista aparecer (debounce de 300ms + a busca)
		const typeAndWaitForList = async (
			user: ReturnType<typeof userEvent.setup>,
			text = 'carta de',
		) => {
			await user.type(screen.getByRole('combobox'), text)
			return screen.findAllByRole('option')
		}

		it('should expose the input as a combobox that starts collapsed', () => {
			renderWithClient(<SearchBar />)

			const input = screen.getByRole('combobox', { name: 'Buscar cartas' })
			expect(input).toHaveAttribute('aria-expanded', 'false')
			expect(input).toHaveAttribute('aria-autocomplete', 'list')
			expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
		})

		it('should list the matching cards after typing', async () => {
			const user = userEvent.setup()
			renderWithClient(<SearchBar />)

			const options = await typeAndWaitForList(user)

			expect(options).toHaveLength(8)
			expect(options[0]).toHaveTextContent('Carta de Teste 1')
			expect(screen.getByRole('combobox')).toHaveAttribute(
				'aria-expanded',
				'true',
			)
			expect(
				screen.getByRole('listbox', { name: 'Sugestões de cartas' }),
			).toBeInTheDocument()
		})

		it('should not suggest anything with a single character', async () => {
			const user = userEvent.setup()
			renderWithClient(<SearchBar />)

			await user.type(screen.getByRole('combobox'), 'c')
			await new Promise((resolve) => setTimeout(resolve, 450))

			expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
		})

		it('should not show the list when no card matches', async () => {
			server.use(
				http.get(CARDINFO_URL, () =>
					HttpResponse.json(
						{ error: 'No card matching your query was found in the database.' },
						{ status: 400 },
					),
				),
			)
			const user = userEvent.setup()
			renderWithClient(<SearchBar />)

			await user.type(screen.getByRole('combobox'), 'zzzz')
			await new Promise((resolve) => setTimeout(resolve, 600))

			expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
		})

		it('should go to the card when a suggestion is clicked', async () => {
			const user = userEvent.setup()
			renderWithClient(<SearchBar />)

			const [first] = await typeAndWaitForList(user)
			await user.click(first)

			expect(navigate).toHaveBeenCalledWith({
				to: '/card/$id',
				params: { id: '1' },
			})
			expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
		})

		it('should move through the suggestions with the arrow keys', async () => {
			const user = userEvent.setup()
			renderWithClient(<SearchBar />)
			const options = await typeAndWaitForList(user)
			const input = screen.getByRole('combobox')

			await user.keyboard('{ArrowDown}')
			expect(options[0]).toHaveAttribute('aria-selected', 'true')
			expect(input).toHaveAttribute('aria-activedescendant', options[0].id)

			await user.keyboard('{ArrowDown}')
			expect(options[1]).toHaveAttribute('aria-selected', 'true')
			expect(options[0]).toHaveAttribute('aria-selected', 'false')

			await user.keyboard('{ArrowUp}{ArrowUp}')
			// de volta ao topo e dando a volta para o último
			expect(options[7]).toHaveAttribute('aria-selected', 'true')
			// o foco nunca sai do campo
			expect(input).toHaveFocus()
		})

		it('should go to the highlighted card with Enter', async () => {
			const user = userEvent.setup()
			renderWithClient(<SearchBar />)
			await typeAndWaitForList(user)

			await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

			expect(navigate).toHaveBeenCalledWith({
				to: '/card/$id',
				params: { id: '2' },
			})
		})

		it('should apply the search right away with Enter when nothing is highlighted', async () => {
			const user = userEvent.setup()
			renderWithClient(<SearchBar />)
			await typeAndWaitForList(user, 'carta')

			await user.keyboard('{Enter}')

			expect(navigate).not.toHaveBeenCalled()
			expect(useSearchTermStore.getState().term).toBe('carta')
			expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
		})

		it('should close the list with Escape without letting the event bubble up', async () => {
			const user = userEvent.setup()
			const onParentKeyDown = vi.fn()
			renderWithClient(
				<div onKeyDown={onParentKeyDown}>
					<SearchBar />
				</div>,
			)
			await typeAndWaitForList(user)
			onParentKeyDown.mockClear()

			await user.keyboard('{Escape}')

			expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
			expect(onParentKeyDown).not.toHaveBeenCalled()
		})

		it('should let Escape bubble up when the list is closed', async () => {
			const user = userEvent.setup()
			const onParentKeyDown = vi.fn()
			renderWithClient(
				<div onKeyDown={onParentKeyDown}>
					<SearchBar />
				</div>,
			)
			await user.click(screen.getByRole('combobox'))

			await user.keyboard('{Escape}')

			expect(onParentKeyDown).toHaveBeenCalled()
		})

		it('should close the list when the input loses focus', async () => {
			const user = userEvent.setup()
			renderWithClient(<SearchBar />)
			await typeAndWaitForList(user)

			await user.tab()

			await waitFor(() =>
				expect(screen.queryByRole('listbox')).not.toBeInTheDocument(),
			)
		})

		it('should hide the list again when the text goes back under 2 characters', async () => {
			const user = userEvent.setup()
			renderWithClient(<SearchBar />)
			await typeAndWaitForList(user)

			await user.clear(screen.getByRole('combobox'))
			await user.type(screen.getByRole('combobox'), 'c')

			expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
		})

		it('should highlight the part of the name that matches', async () => {
			const user = userEvent.setup()
			renderWithClient(<SearchBar />)

			const [first] = await typeAndWaitForList(user)

			expect(first.querySelector('strong')).toHaveTextContent(/^carta de$/i)
		})
	})
})
