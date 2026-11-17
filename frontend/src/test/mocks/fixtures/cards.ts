import type { Card, CardMidia } from '@/types/card'

export type CardWithMidia = Card & CardMidia

/**
 * Monta uma carta completa no formato da YGOPRODECK.
 * Os valores variam de forma determinística com o id (sem Math.random),
 * então o mesmo id sempre gera a mesma carta e os testes não ficam instáveis.
 * Use `overrides` para forçar um campo específico em um teste.
 */
export const makeCard = (
	id: number,
	overrides: Partial<CardWithMidia> = {},
): CardWithMidia => {
	const code = String(id).padStart(3, '0')
	const price = (1 + (id % 10) * 0.75).toFixed(2)

	return {
		id,
		name: `Carta de Teste ${id}`,
		fname: `Carta de Teste ${id}`,
		type: 'Normal Monster',
		race: 'Spellcaster',
		attribute: 'DARK',
		atk: 1000 + id * 10,
		def: 1000,
		level: 4,
		archetype: 'Teste',
		typeline: ['Spellcaster', 'Normal'],
		humanReadableCardType: 'Normal Monster',
		frameType: 'normal',
		card_prices: [
			{
				tcgplayer_price: price,
				ebay_price: '0.00',
				amazon_price: '0.00',
				coolstuffinc_price: '0.00',
			},
		],
		// Duas impressões: o proxy usa isso para testar a troca de impressão
		card_sets: [
			{
				set_name: 'Starter Deck',
				set_code: `SD1-EN${code}`,
				set_rarity: 'Common',
				set_rarity_code: '(C)',
				set_price: '1.00',
			},
			{
				set_name: 'Legendary Collection',
				set_code: `LC01-EN${code}`,
				set_rarity: 'Ultra Rare',
				set_rarity_code: '(UR)',
				set_price: '3.00',
			},
		],
		card_images: [
			{
				id,
				image_url: `https://example.com/cards/${id}.jpg`,
				image_url_small: `https://example.com/cards/${id}_small.jpg`,
				image_url_cropped: `https://example.com/cards/${id}_cropped.jpg`,
			},
		],
		ygoprodeck_url: `https://ygoprodeck.com/card/?id=${id}`,
		...overrides,
	}
}

/** 45 cartas = 3 páginas de 20 (20 + 20 + 5), para testar o scroll infinito. */
export const CARDS_TOTAL = 45

/** Carta sem nenhum preço, para testar o "Sem preço" no CardItem. */
export const cardWithoutPrice = makeCard(3, {
	name: 'Carta Sem Preço',
	fname: 'Carta Sem Preço',
	card_prices: [],
	card_sets: [],
})

// Gerada uma única vez, quando o módulo carrega
export const cardsFixture: CardWithMidia[] = Array.from(
	{ length: CARDS_TOTAL },
	(_, index) =>
		index + 1 === cardWithoutPrice.id ? cardWithoutPrice : makeCard(index + 1),
)
