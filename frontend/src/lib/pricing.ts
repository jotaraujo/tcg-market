import type { Card } from '@/types/card'

type PriceSource = Pick<Card, 'card_prices' | 'card_sets'>

const toPositivePrices = (value: string | undefined): number | null => {
	const n = Number(value)
	return n > 0 ? n : null
}

export const getCardPriceUsd = (card: PriceSource): number | null => {
	const tcpplayer = toPositivePrices(card.card_prices?.[0]?.tcgplayer_price)
	if (tcpplayer !== null) return tcpplayer

	const setPrices = (card.card_sets ?? [])
		.map((set) => toPositivePrices(set.set_price))
		.filter((price): price is number => price !== null)
  
    return setPrices.length > 0 ? Math.min(...setPrices) : null
}
