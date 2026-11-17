import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, HttpResponse, http } from 'msw'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import SetsPage from '@/pages/SetsPage'
import { SETS_URL, setsFixture } from '@/test/mocks/fixtures/sets'
import { server } from '@/test/mocks/server'
import { renderWithClient } from '@/test/utils'

// O jsdom não tem IntersectionObserver e a paginação não é o foco aqui.
vi.mock('@/hooks/useIntersectionObserver', () => ({
	useIntersectionObserver: vi.fn(() => vi.fn()),
}))

// Mesmo mock do Link usado nos outros testes: evita montar um RouterProvider.
vi.mock('@tanstack/react-router', () => ({
	Link: ({ to, params, children }: any) => (
		<a href={params ? to.replace('$id', params.id) : to}>{children}</a>
	),
}))

const CARDINFO_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'

// Liga o estado à página como a rota faria com a URL
const Harness = () => {
	const [name, setName] = useState<string | undefined>()
	return <SetsPage selectedName={name} onSelectSet={setName} />
}

const tile = (name: string | RegExp) => screen.findByRole('button', { name })

describe('SetsPage', () => {
	it('should list the recent released sets as tiles, newest first', async () => {
		renderWithClient(<Harness />)

		const list = await screen.findByRole('list', {
			name: 'Lançamentos recentes',
		})
		const tiles = within(list).getAllByRole('button')

		expect(tiles.map((t) => t.textContent)).toEqual([
			expect.stringContaining('Tins & Boxes: Test'),
			expect.stringContaining('Fresh Booster'),
			expect.stringContaining('Duelist Pack: Test'),
			expect.stringContaining('Legendary Collection'),
			expect.stringContaining('Starter Deck'),
		])
		expect(screen.queryByText(/Future Booster/)).not.toBeInTheDocument()
		expect(screen.queryByText(/Undated Promo/)).not.toBeInTheDocument()
	})

	it('should filter the tiles by the chosen year', async () => {
		const user = userEvent.setup()
		renderWithClient(<Harness />)

		await user.click(await screen.findByRole('button', { name: '2020' }))

		expect(
			screen.getByRole('heading', { name: 'Coleções de 2020' }),
		).toBeInTheDocument()
		const list = screen.getByRole('list', { name: 'Coleções de 2020' })
		const tiles = within(list).getAllByRole('button')
		expect(tiles).toHaveLength(1)
		expect(tiles[0]).toHaveTextContent('Duelist Pack: Test')
	})

	it('should open a set from a tile and show its cards', async () => {
		const user = userEvent.setup()
		renderWithClient(<Harness />)

		await user.click(await tile(/Legendary Collection/))

		expect(
			await screen.findByRole('heading', { name: 'Legendary Collection' }),
		).toBeInTheDocument()
		expect(await screen.findByText('Carta de Teste 1')).toBeInTheDocument()
		expect(
			screen.queryByRole('list', { name: 'Lançamentos recentes' }),
		).not.toBeInTheDocument()
		expect(
			screen.queryByRole('group', { name: 'Ano de lançamento' }),
		).not.toBeInTheDocument()
	})

	it('should open a set from the search box, including undated ones', async () => {
		const user = userEvent.setup()
		renderWithClient(<Harness />)

		await user.click(
			await screen.findByRole('combobox', { name: 'Buscar coleção' }),
		)
		await user.type(
			await screen.findByPlaceholderText('Nome ou código da coleção'),
			'Undated',
		)
		await user.click(
			await screen.findByRole('option', { name: /Undated Promo/ }),
		)

		expect(
			await screen.findByRole('heading', { name: 'Undated Promo' }),
		).toBeInTheDocument()
	})

	it('should send the exact set name to the API', async () => {
		const searches: URLSearchParams[] = []
		server.use(
			http.get(CARDINFO_URL, ({ request }) => {
				searches.push(new URL(request.url).searchParams)
				return HttpResponse.json({ data: [] })
			}),
		)
		const user = userEvent.setup()
		renderWithClient(<Harness />)

		await user.click(await tile(/Tins & Boxes: Test/))

		await waitFor(() =>
			expect(searches.map((s) => s.get('cardset'))).toContain(
				'Tins & Boxes: Test',
			),
		)
	})

	it('should say the set was not found for an unknown name', async () => {
		const user = userEvent.setup()
		const onSelectSet = vi.fn()
		renderWithClient(<SetsPage selectedName='Nope' onSelectSet={onSelectSet} />)

		expect(
			await screen.findByText('Coleção não encontrada'),
		).toBeInTheDocument()
		await user.click(screen.getByRole('button', { name: 'Ver coleções' }))

		expect(onSelectSet).toHaveBeenCalledWith(undefined)
	})

	it('should show the skeleton, not "not found", while the list loads', async () => {
		server.use(
			http.get(SETS_URL, async () => {
				await delay(100)
				return HttpResponse.json(setsFixture)
			}),
		)
		renderWithClient(
			<SetsPage selectedName='Legendary Collection' onSelectSet={vi.fn()} />,
		)

		expect(screen.getByLabelText('Carregando coleções')).toBeInTheDocument()
		expect(screen.queryByText('Coleção não encontrada')).not.toBeInTheDocument()
		expect(
			await screen.findByRole('heading', { name: 'Legendary Collection' }),
		).toBeInTheDocument()
	})

	it('should keep the chosen year after leaving a set', async () => {
		const user = userEvent.setup()
		renderWithClient(<Harness />)

		await user.click(await screen.findByRole('button', { name: '2020' }))
		await user.click(await tile(/Duelist Pack: Test/))
		await user.click(
			await screen.findByRole('button', { name: 'Trocar coleção' }),
		)

		expect(await screen.findByRole('button', { name: '2020' })).toHaveAttribute(
			'aria-pressed',
			'true',
		)
	})

	it('should show the empty state for a set with no cards', async () => {
		server.use(
			http.get(CARDINFO_URL, () =>
				HttpResponse.json(
					{ error: 'No card matching your query was found in the database.' },
					{ status: 400 },
				),
			),
		)
		const user = userEvent.setup()
		renderWithClient(<Harness />)

		await user.click(await tile(/Legendary Collection/))

		expect(
			await screen.findByText('Nenhuma carta encontrada.'),
		).toBeInTheDocument()
		expect(
			screen.queryByRole('button', { name: /tentar novamente/i }),
		).not.toBeInTheDocument()
	})

	it('should scroll the page container to the top when a set is opened', async () => {
		const user = userEvent.setup()
		// O app rola dentro do <main> do layout, não na janela
		const { container } = renderWithClient(
			<main>
				<Harness />
			</main>,
		)
		const scrollTo = vi.fn()
		container.querySelector('main')!.scrollTo = scrollTo

		await user.click(await tile(/Legendary Collection/))

		await waitFor(() => expect(scrollTo).toHaveBeenCalledWith({ top: 0 }))
	})

	it('should show an error with retry when the list fails', async () => {
		server.use(
			http.get(SETS_URL, () => new HttpResponse(null, { status: 500 })),
		)
		renderWithClient(<Harness />)

		expect(
			await screen.findByRole('button', { name: /tentar novamente/i }),
		).toBeInTheDocument()
	})
})
