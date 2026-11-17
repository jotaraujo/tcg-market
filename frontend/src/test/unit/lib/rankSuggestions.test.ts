import { describe, expect, it } from 'vitest'
import { rankSuggestions } from '@/lib/rankSuggestions'
import { makeCard } from '@/test/mocks/fixtures/cards'

const cardsNamed = (...names: string[]) =>
	names.map((name, index) => makeCard(index + 1, { name }))

describe('rankSuggestions', () => {
	it('should put the names that start with the term before the ones that only contain it', () => {
		const cards = cardsNamed('A Dark Hole', 'Dark Magician', 'Pot of Darkness')

		const result = rankSuggestions(cards, 'dark', 10)

		expect(result.map((card) => card.name)).toEqual([
			'Dark Magician',
			'A Dark Hole',
			'Pot of Darkness',
		])
	})

	it('should keep the original (alphabetical) order inside each group', () => {
		const cards = cardsNamed('B Dark', 'Dark Bat', 'A Dark', 'Dark Ant')

		const result = rankSuggestions(cards, 'dark', 10)

		expect(result.map((card) => card.name)).toEqual([
			'Dark Bat',
			'Dark Ant',
			'B Dark',
			'A Dark',
		])
	})

	it('should ignore case and surrounding spaces in the term', () => {
		const cards = cardsNamed('Blue-Eyes White Dragon', 'Red-Eyes Dragon')

		const result = rankSuggestions(cards, '  RED ', 10)

		expect(result[0].name).toBe('Red-Eyes Dragon')
	})

	it('should respect the limit', () => {
		const cards = cardsNamed('Dark 1', 'Dark 2', 'Dark 3')

		expect(rankSuggestions(cards, 'dark', 2)).toHaveLength(2)
	})

	it('should not mutate the list it received', () => {
		const cards = cardsNamed('A Dark', 'Dark B')

		rankSuggestions(cards, 'dark', 10)

		expect(cards.map((card) => card.name)).toEqual(['A Dark', 'Dark B'])
	})

	it('should just cut the list when the term is empty', () => {
		const cards = cardsNamed('A', 'B', 'C')

		expect(rankSuggestions(cards, '  ', 2).map((card) => card.name)).toEqual([
			'A',
			'B',
		])
	})
})
