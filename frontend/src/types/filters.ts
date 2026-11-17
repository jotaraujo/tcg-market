import { CARD_TYPES, CARD_RACES } from './card'
import type { CardType, CardRace } from './card'

export interface CardFilters {
	name?: string
	fname?: string
	archetype?: string
	attribute?: string
	race?: CardRace
	type?: CardType
	level?: number
	sort?: 'atk' | 'def' | 'name' | 'level'
	cardset?: string
	format?: string
	staple?: 'yes'
	banlist?: 'tcg' | 'ocg' | 'goat'
	num?: number // quantos itens por página
	offset?: number // a partir de qual item começar
}

// Junção de todas as raças e tipos em um array
// para ser usado em um select genérico para os filtros
export const RACE_OPTIONS = [
	...CARD_RACES.monster,
	...CARD_RACES.spell,
	...CARD_RACES.trap,
]

export const TYPE_OPTIONS = [
	...CARD_TYPES.mainDeck,
	...CARD_TYPES.extraDeck,
	...CARD_TYPES.otherTypes,
]
