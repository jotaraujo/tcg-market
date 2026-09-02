export const CARD_TYPES = {
	mainDeck: [
		'Effect Monster',
		'Flip Effect Monster',
		'Flip Tuner Effect Monster',
		'Gemini Monster',
		'Normal Monster',
		'Normal Tuner Monster',
		'Pendulum Effect Monster',
		'Pendulum Effect Ritual Monster',
		'Pendulum Flip Effect Monster',
		'Pendulum Normal Monster',
		'Pendulum Tuner Effect Monster',
		'Ritual Effect Monster',
		'Ritual Monster',
		'Spell Card',
		'Spirit Monster',
		'Toon Monster',
		'Trap Card',
		'Tuner Monster',
		'Union Effect Monster',
	],
	extraDeck: [
		'Fusion Monster',
		'Link Monster',
		'Pendulum Effect Fusion Monster',
		'Synchro Monster',
		'Synchro Pendulum Effect Monster',
		'Synchro Tuner Monster',
		'XYZ Monster',
		'XYZ Pendulum Effect Monster',
	],
	otherTypes: ['Skill Card', 'Token'],
} as const
// ☝️ "as const" trava cada valor do array como um tipo LITERAL exato
// (ex: "Aqua" em vez de "string" genérico) e torna o objeto readonly.
// Sem isso, tudo abaixo vira só "string" e perde a validação.

export const CARD_RACES = {
	monster: [
		'Aqua',
		'Beast',
		'Beast-Warrior',
		'Creator-God',
		'Cyberse',
		'Dinosaur',
		'Divine-Beast',
		'Dragon',
		'Fairy',
		'Fiend',
		'Fish',
		'Insect',
		'Machine',
		'Plant',
		'Psychic',
		'Pyro',
		'Reptile',
		'Rock',
		'Sea Serpent',
		'Spellcaster',
		'Thunder',
		'Warrior',
		'Winged Beast',
		'Wyrm',
		'Zombie',
	],
	spell: ['Normal', 'Field', 'Equip', 'Continuous', 'Quick-Play', 'Ritual'],
	trap: ['Normal', 'Continuous', 'Counter'],
} as const

export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES][number]
export type CardRace = (typeof CARD_RACES)[keyof typeof CARD_RACES][number]
// ☝️ PADRÃO "DERIVED TYPE" (Single Source of Truth [SSOT]):
// Gera automaticamente um union type com TODOS os valores de TODAS
// as chaves do objeto acima, sem precisar escrever "Aqua" | "Beast" | ... na mão.
//
// Como funciona (leia de dentro pra fora):
// 1. typeof CARD_RACES        -> pega o TIPO do objeto (não o valor)
// 2. keyof typeof CARD_RACES  -> pega as CHAVES do objeto ("monster" | "spell" | "trap")
// 3. Objeto[chaves]           -> pega os VALORES (arrays) de cada chave
// 4. [number]                 -> "achata" os arrays, extraindo o tipo de cada ITEM individual
//
// Resultado: se eu adicionar/remover um item no CARD_RACES, o tipo
// CardRace se atualiza SOZINHO. Nunca fica desincronizado do valor real.

export interface CardImage {
	id: number
	image_url: string
	image_url_small: string
	image_url_cropped: string
}

export interface CardSet {
	set_name: string
	set_code: string
	set_rarity: string
	set_rarity_code: string
	set_price: string
}

export interface CardPrice {
	tcgplayer_price: string
	ebay_price: string
	amazon_price: string
	coolstuffinc_price: string
}

export interface Card {
	id: number
	name: string
	fname: string
	type: CardType
	race: CardRace
	attribute?: 'DARK' | 'DIVINE' | 'EARTH' | 'FIRE' | 'LIGHT' | 'WATER' | 'WIND'
	atk?: number | null
	def?: number | null
	level?: number
	archetype?: string
	typeline: string[]
	humanReadableCardType: string
	frameType: string
	linkval?: number
	linkmarkers?: string[]
	card_prices: CardPrice[]
	card_sets: CardSet[]
}

export interface CardMidia {
	ygoprodeck_url: string
	card_images: CardImage[]
	card_sets: CardSet[]
	card_prices: CardPrice[]
}

export interface CardApiMeta {
	current_rows: number
	total_rows: number
	rows_remaining: number
	total_pages: number
	pages_remaining: number
	next_page?: string
	previous_page?: string
	next_page_offset: number
	prev_page_offset: number
}

export interface CardApiResponse {
  data: (Card & CardMidia)[]
	meta?: CardApiMeta
}
