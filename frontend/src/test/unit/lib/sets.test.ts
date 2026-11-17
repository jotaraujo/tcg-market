import { describe, expect, it } from 'vitest'
import {
	findSetByName,
	getRecentSets,
	getSearchableSets,
	getSetPrinting,
	getSetsByYear,
	getSetYears,
	isUnreleased,
} from '@/lib/sets'
import type { CardSet } from '@/types/card'
import type { YgoSet } from '@/types/set'

const TODAY = new Date('2026-11-17T12:00:00Z')

const makeSet = (set_name: string, tcg_date?: string): YgoSet => ({
	set_name,
	set_code: set_name.toUpperCase(),
	num_of_cards: 10,
	tcg_date,
})

const OLD = makeSet('OLD', '2002-03-08')
const MID = makeSet('MID', '2020-05-01')
const NEW = makeSet('NEW', '2026-11-12')
const NEW2 = makeSet('NEW2', '2026-10-08')
const FUTURE = makeSet('FUTURE', '2027-03-19')
const NODATE = makeSet('NODATE')

// Fora de ordem de propósito: a ordenação é responsabilidade das funções
const SETS = [OLD, FUTURE, NEW2, NODATE, MID, NEW]

const names = (sets: YgoSet[]) => sets.map((set) => set.set_name)

describe('isUnreleased', () => {
	it('should be true for a set dated after today', () => {
		expect(isUnreleased(FUTURE, TODAY)).toBe(true)
	})

	it('should be false for a set without a date', () => {
		expect(isUnreleased(NODATE, TODAY)).toBe(false)
	})

	it('should be false for a set released today', () => {
		expect(isUnreleased(makeSet('TODAY', '2026-11-17'), TODAY)).toBe(false)
	})
})

describe('getSearchableSets', () => {
	it('should drop unreleased sets, newest first, undated last', () => {
		expect(names(getSearchableSets(SETS, TODAY))).toEqual([
			'NEW',
			'NEW2',
			'MID',
			'OLD',
			'NODATE',
		])
	})
})

describe('getRecentSets', () => {
	it('should return the newest released sets up to the limit', () => {
		expect(names(getRecentSets(SETS, TODAY, 2))).toEqual(['NEW', 'NEW2'])
	})

	it('should never include undated or unreleased sets', () => {
		const recent = names(getRecentSets(SETS, TODAY))

		expect(recent).not.toContain('NODATE')
		expect(recent).not.toContain('FUTURE')
	})

	it('should default to 12 sets', () => {
		const many = Array.from({ length: 20 }, (_, i) =>
			makeSet(`S${i}`, `2020-01-${String(i + 1).padStart(2, '0')}`),
		)

		expect(getRecentSets(many, TODAY)).toHaveLength(12)
	})
})

describe('getSetYears', () => {
	it('should list the distinct released years, newest first', () => {
		expect(
			getSetYears([...SETS, makeSet('NEW3', '2026-01-01')], TODAY),
		).toEqual([2026, 2020, 2002])
	})
})

describe('getSetsByYear', () => {
	it('should return the released sets of that year, newest first', () => {
		expect(names(getSetsByYear(SETS, 2026, TODAY))).toEqual(['NEW', 'NEW2'])
	})

	it('should return nothing for a year with only unreleased sets', () => {
		expect(getSetsByYear(SETS, 2027, TODAY)).toEqual([])
	})
})

describe('findSetByName', () => {
	it('should find a set by its exact name', () => {
		expect(findSetByName(SETS, 'MID')).toBe(MID)
	})

	it('should not match a different casing', () => {
		expect(findSetByName(SETS, 'mid')).toBeUndefined()
	})
})

describe('getSetPrinting', () => {
	const entry = (
		set_name: string,
		set_code: string,
		set_rarity: string,
	): CardSet => ({
		set_name,
		set_code,
		set_rarity,
		set_rarity_code: '',
		set_price: '0.00',
	})

	const card = {
		card_sets: [
			entry('A', 'A-EN001', 'Common'),
			entry('B', 'B-EN001', 'Ultra Rare'),
		],
	}

	it('should return the code and rarity of the printing in that set', () => {
		expect(getSetPrinting(card, 'B')).toEqual({
			setCode: 'B-EN001',
			rarity: 'Ultra Rare',
		})
	})

	it('should return undefined when the card is not in the set', () => {
		expect(getSetPrinting(card, 'C')).toBeUndefined()
	})

	it('should return undefined without a set name', () => {
		expect(getSetPrinting(card, undefined)).toBeUndefined()
	})

	it('should return undefined for a card without card_sets', () => {
		expect(getSetPrinting({}, 'A')).toBeUndefined()
	})
})
