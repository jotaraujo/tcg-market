import type { Printing, UnifiedCardResponse } from '@/types/proxy'
import type { CardWithMidia } from './cards'

// Datas fixas (e não "hoje - N dias") para o teste dar o mesmo resultado sempre
const PRICE_HISTORY = [
	{ date: '2026-11-07', price: 2.1 },
	{ date: '2026-11-08', price: 2.2 },
	{ date: '2026-11-09', price: 2.15 },
	{ date: '2026-11-10', price: 2.3 },
	{ date: '2026-11-11', price: 2.4 },
	{ date: '2026-11-12', price: 2.35 },
	{ date: '2026-11-13', price: 2.5 },
]

/**
 * Monta a resposta do proxy (UnifiedCardResponse) a partir de uma carta da
 * fixture, para o detalhe da carta bater com o que a listagem mostra.
 */
export const makeTcgResponse = (
	card: CardWithMidia,
	overrides: Partial<UnifiedCardResponse> = {},
): UnifiedCardResponse => {
	const printings: Printing[] = card.card_sets.map((set) => ({
		setCode: set.set_code,
		setName: set.set_name,
		rarity: set.set_rarity,
	}))

	return {
		metadata: {
			id: String(card.id),
			name: card.name,
			type: card.type,
			race: card.race,
			attribute: card.attribute,
			level: card.level,
			atk: card.atk ?? undefined,
			def: card.def ?? undefined,
			imageUrl: card.card_images[0].image_url,
			currentPrice: card.card_prices[0]?.tcgplayer_price ?? '0.00',
		},
		selectedPrinting: printings[0] ?? null,
		printings,
		priceHistory: PRICE_HISTORY,
		priceHistoryStatus: 'ok',
		source: 'proxy-v1',
		...overrides,
	}
}
