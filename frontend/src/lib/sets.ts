import type { CardSet } from '@/types/card'
import type { YgoSet } from '@/types/set'

// AAAA-MM-DD em UTC: a data da API não tem horário, então comparar como texto
// evita erro de fuso.
const toIsoDay = (date: Date) => date.toISOString().slice(0, 10)

// Mais nova primeiro; sem data vai para o fim.
const byNewest = (a: YgoSet, b: YgoSet) => {
	if (!a.tcg_date && !b.tcg_date) return 0
	if (!a.tcg_date) return 1
	if (!b.tcg_date) return -1
	return b.tcg_date.localeCompare(a.tcg_date)
}

// Coleção futura é só um anúncio (poucas cartas conhecidas); sem data não conta
// como futura.
export const isUnreleased = (set: YgoSet, today: Date): boolean =>
	set.tcg_date !== undefined && set.tcg_date > toIsoDay(today)

// Lançadas e com data, da mais nova para a mais antiga (base dos tiles e dos anos)
export const getReleasedSets = (sets: YgoSet[], today: Date): YgoSet[] =>
	sets
		.filter((set) => set.tcg_date !== undefined && !isUnreleased(set, today))
		.sort(byNewest)

export const getSearchableSets = (sets: YgoSet[], today: Date): YgoSet[] =>
	sets.filter((set) => !isUnreleased(set, today)).sort(byNewest)

const yearOf = (set: YgoSet) => Number(set.tcg_date?.slice(0, 4))

export const getSetYears = (sets: YgoSet[], today: Date): number[] => [
	...new Set(getReleasedSets(sets, today).map(yearOf)),
]

export const getSetsByYear = (
	sets: YgoSet[],
	year: number,
	today: Date,
): YgoSet[] =>
	getReleasedSets(sets, today).filter((set) => yearOf(set) === year)

// Nome exato: os nomes são únicos na API, os códigos não (ex.: YS15 ×3)
export const findSetByName = (
	sets: YgoSet[],
	name: string,
): YgoSet | undefined => sets.find((set) => set.set_name === name)

// Impressão da carta naquela coleção, no formato que /card/$id espera
export const getSetPrinting = (
	card: { card_sets?: CardSet[] },
	setName?: string,
): { setCode: string; rarity: string } | undefined => {
	const printing = card.card_sets?.find((set) => set.set_name === setName)
	return printing && { setCode: printing.set_code, rarity: printing.set_rarity }
}
