import { getCardPriceUsd } from '@/lib/pricing'
import type { CardPrice, CardSet } from '@/types/card'

const prices = (tcgplayer_price: string): CardPrice[] => [
	{
		tcgplayer_price,
		ebay_price: '0',
		amazon_price: '0',
		coolstuffinc_price: '0',
	},
]

const sets = (...setPrices: string[]): CardSet[] =>
	setPrices.map((set_price, i) => ({
		set_name: `Set ${i}`,
		set_code: `SET-EN00${i}`,
		set_rarity: `Common`,
		set_rarity_code: `(C)`,
		set_price,
	}))

describe('getCardPriceUsd', () => {
	it('usa o tcgplayer_price quando ele existe', () => {
		expect(
			getCardPriceUsd({ card_prices: prices('0.25'), card_sets: [] }),
		).toBe(0.25)
	})

	it('prefere o tcgplayer_price mesmo havendo set mais barato', () => {
		expect(
			getCardPriceUsd({ card_prices: prices('0.25'), card_sets: sets('0.10') }),
		).toBe(0.25)
	})

	it('cai para o menor set_price > 0 quando o tcgplayer é zero', () => {
		expect(
			getCardPriceUsd({
				card_prices: prices('0.00'),
				card_sets: sets('0', '2.10', '1.07'),
			}),
		).toBe(1.07)
	})

	it('retorna null sem preços e sem sets', () => {
		expect(getCardPriceUsd({ card_prices: [], card_sets: [] })).toBeNull()
	})

	it('retorna null quando tudo é zero', () => {
		expect(
			getCardPriceUsd({ card_prices: prices('0'), card_sets: sets('0', '0') }),
		).toBeNull()
	})
})
