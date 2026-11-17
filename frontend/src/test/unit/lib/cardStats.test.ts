import { describe, expect, it } from 'vitest'
import { getCardStats } from '@/lib/cardStats'
import type { UnifiedCardMetadata } from '@/types/proxy'

const makeMetadata = (
	overrides: Partial<UnifiedCardMetadata> = {},
): UnifiedCardMetadata => ({
	id: '1',
	name: 'Carta',
	type: 'Effect Monster',
	race: 'Warrior',
	imageUrl: '',
	currentPrice: '',
	...overrides,
})

describe('getCardStats', () => {
	it('should return ATK, DEF and level for a regular monster', () => {
		const stats = getCardStats(makeMetadata({ atk: 2500, def: 2100, level: 7 }))

		expect(stats).toEqual([
			{ label: 'ATK', value: 2500 },
			{ label: 'DEF', value: 2100 },
			{ label: 'Nível', value: 7 },
		])
	})

	it('should keep level for Synchro and Fusion monsters', () => {
		const stats = getCardStats(
			makeMetadata({
				type: 'Synchro Monster',
				atk: 3000,
				def: 2500,
				level: 8,
			}),
		)

		expect(stats.map((s) => s.label)).toEqual(['ATK', 'DEF', 'Nível'])
	})

	it('should call the level "Rank" for Xyz monsters', () => {
		const stats = getCardStats(
			makeMetadata({ type: 'XYZ Monster', atk: 2500, def: 2000, level: 4 }),
		)

		expect(stats).toEqual([
			{ label: 'ATK', value: 2500 },
			{ label: 'DEF', value: 2000 },
			{ label: 'Rank', value: 4 },
		])
	})

	it('should show level and scale in a single stat for Pendulum monsters', () => {
		const stats = getCardStats(
			makeMetadata({
				type: 'Pendulum Effect Monster',
				atk: 2500,
				def: 2100,
				level: 7,
				scale: 8,
			}),
		)

		expect(stats).toEqual([
			{ label: 'ATK', value: 2500 },
			{ label: 'DEF', value: 2100 },
			{ label: 'Nível / Escala', value: '7 / 8' },
		])
	})

	it('should combine rank and scale for Xyz Pendulum monsters', () => {
		const stats = getCardStats(
			makeMetadata({
				type: 'XYZ Pendulum Effect Monster',
				atk: 2500,
				def: 2000,
				level: 4,
				scale: 1,
			}),
		)

		expect(stats.at(-1)).toEqual({ label: 'Rank / Escala', value: '4 / 1' })
	})

	it('should show ATK, link rating and arrows (no DEF, no level) for Link monsters', () => {
		const stats = getCardStats(
			makeMetadata({
				type: 'Link Monster',
				atk: 2300,
				linkval: 3,
				linkmarkers: ['Top-Left', 'Top', 'Bottom-Right'],
			}),
		)

		expect(stats).toEqual([
			{ label: 'ATK', value: 2300 },
			{ label: 'Link', value: 3 },
			{ label: 'Setas', value: '↖ ↑ ↘' },
		])
	})

	it('should omit the arrows stat when a Link monster has no markers', () => {
		const stats = getCardStats(
			makeMetadata({ type: 'Link Monster', atk: 0, linkval: 1 }),
		)

		expect(stats.map((s) => s.label)).toEqual(['ATK', 'Link'])
	})

	it('should return nothing for Spells and Traps', () => {
		expect(getCardStats(makeMetadata({ type: 'Spell Card' }))).toEqual([])
	})

	it('should keep a zero ATK/DEF instead of dropping it', () => {
		const stats = getCardStats(makeMetadata({ atk: 0, def: 0, level: 1 }))

		expect(stats[0]).toEqual({ label: 'ATK', value: 0 })
		expect(stats[1]).toEqual({ label: 'DEF', value: 0 })
	})
})
