import { describe, expect, it } from 'vitest'
import { getPriceVariation } from '@/lib/priceVariation'

const history = (...prices: number[]) =>
	prices.map((price, index) => ({
		date: `2026-11-${String(index + 1).padStart(2, '0')}`,
		price,
	}))

describe('getPriceVariation', () => {
	it('should compare the last price with the first one', () => {
		expect(getPriceVariation(history(2, 2.5, 3))).toEqual({
			percent: 50,
			direction: 'up',
		})
	})

	it('should report a drop as negative', () => {
		expect(getPriceVariation(history(4, 3, 3))).toEqual({
			percent: -25,
			direction: 'down',
		})
	})

	it('should round to one decimal place', () => {
		// (2.5 - 2.1) / 2.1 = 19.047...%
		expect(getPriceVariation(history(2.1, 2.5))?.percent).toBe(19)
	})

	it('should be flat when the price did not change', () => {
		expect(getPriceVariation(history(2, 3, 2))).toEqual({
			percent: 0,
			direction: 'flat',
		})
	})

	it('should be flat when the change rounds to zero', () => {
		expect(getPriceVariation(history(1000, 1000.01))?.direction).toBe('flat')
	})

	it('should not invent a number with fewer than 2 points', () => {
		expect(getPriceVariation([])).toBeNull()
		expect(getPriceVariation(history(2))).toBeNull()
	})

	it('should not divide by a first price of zero', () => {
		expect(getPriceVariation(history(0, 3))).toBeNull()
	})
})
