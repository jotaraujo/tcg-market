import type { CardRace, CardType } from './card'
import { CARD_RACES, CARD_TYPES } from './card'

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
// para ser usado em um select genérico para os filtros.
// O Set remove as repetidas: "Normal" e "Continuous" existem em spell e trap.
export const RACE_OPTIONS: CardRace[] = [
	...new Set<CardRace>([
		...CARD_RACES.monster,
		...CARD_RACES.spell,
		...CARD_RACES.trap,
	]),
]

export const TYPE_OPTIONS: CardType[] = [
	...CARD_TYPES.mainDeck,
	...CARD_TYPES.extraDeck,
	...CARD_TYPES.otherTypes,
]

export const ATTRIBUTE_OPTIONS = [
	'DARK',
	'DIVINE',
	'EARTH',
	'FIRE',
	'LIGHT',
	'WATER',
	'WIND',
] as const

// Nível/rank de 1 a 12 (cobre monstros normais, XYZ e Synchro)
export const LEVEL_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1)

// A API só ordena por estes campos (não existe ordenação por preço)
export const SORT_OPTIONS: {
	value: NonNullable<CardFilters['sort']>
	label: string
}[] = [
	{ value: 'name', label: 'Nome' },
	{ value: 'atk', label: 'ATK' },
	{ value: 'def', label: 'DEF' },
	{ value: 'level', label: 'Nível' },
]

// Só os campos que o usuário escolhe na barra de filtros
export type SelectableFilters = Pick<
	CardFilters,
	'type' | 'attribute' | 'race' | 'level' | 'sort'
>
