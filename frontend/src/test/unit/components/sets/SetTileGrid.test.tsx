import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SetTileGrid from '@/components/sets/SetTileGrid'
import type { YgoSet } from '@/types/set'

// O jsdom não tem IntersectionObserver: o mock guarda o último `onIntersect`
// recebido para o teste "rolar até o fim" chamar na mão, e devolve o mesmo
// `sentinelRef` em toda renderização.
const observer = vi.hoisted(() => ({
	onIntersect: undefined as (() => void) | undefined,
	enabled: undefined as boolean | undefined,
	sentinelRef: vi.fn(),
}))

vi.mock('@/hooks/useIntersectionObserver', () => ({
	useIntersectionObserver: (props: {
		onIntersect: () => void
		enabled: boolean
	}) => {
		observer.onIntersect = props.onIntersect
		observer.enabled = props.enabled
		return observer.sentinelRef
	},
}))

const makeSets = (count: number): YgoSet[] =>
	Array.from({ length: count }, (_, index) => ({
		set_name: `Coleção ${index + 1}`,
		set_code: `C${index + 1}`,
		num_of_cards: 10,
		tcg_date: '2020-01-01',
	}))

const scrollToEnd = () => act(() => observer.onIntersect?.())

describe('SetTileGrid', () => {
	beforeEach(() => {
		observer.onIntersect = undefined
		observer.enabled = undefined
	})

	it('should render the title as a heading and name the list after it', () => {
		render(
			<SetTileGrid
				sets={makeSets(3)}
				title='Todas as coleções'
				onSelect={vi.fn()}
			/>,
		)

		expect(
			screen.getByRole('heading', { name: 'Todas as coleções' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('list', { name: 'Todas as coleções' }),
		).toBeInTheDocument()
	})

	it('should render only the first batch of 24 tiles', () => {
		render(<SetTileGrid sets={makeSets(60)} title='Todas' onSelect={vi.fn()} />)

		const tiles = within(
			screen.getByRole('list', { name: 'Todas' }),
		).getAllByRole('button')

		expect(tiles).toHaveLength(24)
		expect(tiles[0]).toHaveTextContent('Coleção 1')
		expect(tiles[23]).toHaveTextContent('Coleção 24')
		expect(observer.enabled).toBe(true)
	})

	it('should render the next batch when the sentinel is reached', () => {
		render(<SetTileGrid sets={makeSets(60)} title='Todas' onSelect={vi.fn()} />)

		scrollToEnd()

		expect(
			within(screen.getByRole('list', { name: 'Todas' })).getAllByRole(
				'button',
			),
		).toHaveLength(48)
	})

	it('should render every set and show the end message after the last batch', () => {
		render(<SetTileGrid sets={makeSets(30)} title='Todas' onSelect={vi.fn()} />)

		expect(screen.getByRole('status')).toBeEmptyDOMElement()

		scrollToEnd()

		expect(
			within(screen.getByRole('list', { name: 'Todas' })).getAllByRole(
				'button',
			),
		).toHaveLength(30)
		expect(screen.getByRole('status')).toHaveTextContent(
			'Fim da lista · 30 coleções',
		)
		expect(observer.enabled).toBe(false)
	})

	it('should show the end message right away when everything fits in one batch', () => {
		render(<SetTileGrid sets={makeSets(5)} title='Todas' onSelect={vi.fn()} />)

		expect(screen.getByRole('status')).toHaveTextContent(
			'Fim da lista · 5 coleções',
		)
	})

	it('should use the singular when there is a single set', () => {
		render(<SetTileGrid sets={makeSets(1)} title='Todas' onSelect={vi.fn()} />)

		expect(screen.getByRole('status')).toHaveTextContent(
			'Fim da lista · 1 coleção',
		)
		expect(screen.getByRole('status')).not.toHaveTextContent('coleções')
	})

	it('should call onSelect with the set name when a tile is clicked', async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		render(<SetTileGrid sets={makeSets(3)} title='Todas' onSelect={onSelect} />)

		await user.click(screen.getByRole('button', { name: /Coleção 2/ }))

		expect(onSelect).toHaveBeenCalledWith('Coleção 2')
	})
})
