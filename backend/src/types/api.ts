/**
 * CONSTANTES DE VALIDAÇÃO (Single Source of Truth)
 * Baseado nos dados reais da API YGOPRODECK
 */

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

// Tipos Derivados (Union Types)
export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES][number]
export type CardRace = (typeof CARD_RACES)[keyof typeof CARD_RACES][number]
export type CardAttribute =
	| 'DARK'
	| 'DIVINE'
	| 'EARTH'
	| 'FIRE'
	| 'LIGHT'
	| 'WATER'
	| 'WIND'

/**
 * Interfaces para as respostas BRUTAS das APIs externas.
 */

export interface YGOPRODECK_RawCard {
	id: number
	name: string
	type: CardType // Tipagem Forte
	race: CardRace // Tipagem Forte
	attribute: CardAttribute // Tipagem Forte
	level: number
	atk: number
	def: number
	card_images: {
		image_url: string
	}[]
	set_name: string
	set_rarity: string
	tcgplayer_price: string
	[key: string]: any
}

export interface YGOPRODECK_ApiResponse {
	data: YGOPRODECK_RawCard[]
}

export interface JustTCG_PriceEntry {
	date: string
	price: number
}

export interface JustTCG_ApiResponse {
	prices: JustTCG_PriceEntry[]
	card_id: string
	[key: string]: any
}
