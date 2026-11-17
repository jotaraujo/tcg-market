import { describe, expect, it } from 'vitest'
import {
	clearFilters,
	countActiveFilters,
	raceOptionsFor,
	setFilter,
} from '@/lib/filterRules'

describe('setFilter', () => {
	it('should set a value on an empty filter object', () => {
		expect(setFilter({}, 'attribute', 'WATER')).toEqual({ attribute: 'WATER' })
	})

	it('should not mutate the previous filters', () => {
		const previous = { attribute: 'WATER' }
		setFilter(previous, 'attribute', 'FIRE')
		expect(previous).toEqual({ attribute: 'WATER' })
	})

	it('should remove the key when the value is empty ("Todos")', () => {
		expect(
			setFilter({ attribute: 'WATER', sort: 'atk' }, 'attribute', ''),
		).toEqual({
			sort: 'atk',
		})
	})

	it('should store the level as a number', () => {
		expect(setFilter({}, 'level', '4')).toEqual({ level: 4 })
	})

	describe('regras entre tipo, atributo, nível e raça', () => {
		it('should clear attribute and level when a Spell Card type is chosen', () => {
			const next = setFilter(
				{ attribute: 'WATER', level: 4, sort: 'atk' },
				'type',
				'Spell Card',
			)
			expect(next).toEqual({ type: 'Spell Card', sort: 'atk' })
		})

		it('should clear attribute and level when a Trap Card type is chosen', () => {
			const next = setFilter(
				{ attribute: 'DARK', level: 8 },
				'type',
				'Trap Card',
			)
			expect(next).toEqual({ type: 'Trap Card' })
		})

		it('should keep attribute and level when a monster type is chosen', () => {
			const next = setFilter(
				{ attribute: 'WATER', level: 4 },
				'type',
				'Effect Monster',
			)
			expect(next).toEqual({
				type: 'Effect Monster',
				attribute: 'WATER',
				level: 4,
			})
		})

		it('should clear a race that does not exist for the new type', () => {
			const next = setFilter({ race: 'Dragon' }, 'type', 'Spell Card')
			expect(next).toEqual({ type: 'Spell Card' })
		})

		it('should keep a race that is valid for the new type', () => {
			expect(setFilter({ race: 'Quick-Play' }, 'type', 'Spell Card')).toEqual({
				type: 'Spell Card',
				race: 'Quick-Play',
			})
			expect(setFilter({ race: 'Dragon' }, 'type', 'Effect Monster')).toEqual({
				type: 'Effect Monster',
				race: 'Dragon',
			})
		})

		it('should keep the race when the type goes back to "Todos"', () => {
			expect(
				setFilter({ type: 'Spell Card', race: 'Field' }, 'type', ''),
			).toEqual({ race: 'Field' })
		})
	})
})

describe('raceOptionsFor', () => {
	it('should list only spell races for Spell Card', () => {
		const options = raceOptionsFor('Spell Card')
		expect(options).toContain('Quick-Play')
		expect(options).not.toContain('Dragon')
	})

	it('should list only trap races for Trap Card', () => {
		const options = raceOptionsFor('Trap Card')
		expect(options).toContain('Counter')
		expect(options).not.toContain('Quick-Play')
	})

	it('should list only monster races for a monster type', () => {
		const options = raceOptionsFor('Effect Monster')
		expect(options).toContain('Dragon')
		expect(options).not.toContain('Counter')
	})

	it('should list every race, without duplicates, when there is no type', () => {
		const options = raceOptionsFor(undefined)
		expect(options).toContain('Dragon')
		expect(options).toContain('Quick-Play')
		expect(options).toContain('Counter')
		expect(new Set(options).size).toBe(options.length)
	})
})

describe('countActiveFilters', () => {
	it('should count only the filters that are set', () => {
		expect(countActiveFilters({})).toBe(0)
		expect(countActiveFilters({ type: 'Effect Monster', level: 4 })).toBe(2)
	})

	it('should not count the sort order as a filter', () => {
		expect(countActiveFilters({ sort: 'atk' })).toBe(0)
	})
})

describe('clearFilters', () => {
	it('should drop every filter but keep the sort order', () => {
		expect(
			clearFilters({ type: 'Effect Monster', level: 4, sort: 'atk' }),
		).toEqual({ sort: 'atk' })
	})

	it('should return an empty object when there is no sort order', () => {
		expect(clearFilters({ attribute: 'WATER' })).toEqual({})
	})
})
