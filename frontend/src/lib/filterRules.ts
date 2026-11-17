import type { CardRace, CardType } from '@/types/card'
import { CARD_RACES } from '@/types/card'
import type { SelectableFilters } from '@/types/filters'
import { RACE_OPTIONS } from '@/types/filters'

type FilterKey = keyof SelectableFilters

// Spell e Trap não têm atributo nem nível: filtrar por eles junto com esses
// tipos nunca devolve cartas (a API responde "nenhuma carta").
const isSpellOrTrap = (type?: CardType) =>
	type === 'Spell Card' || type === 'Trap Card'

// A raça depende do tipo: "Quick-Play" só existe em Spell, "Counter" só em Trap
// e "Dragon" só em monstros. Sem tipo escolhido, vale qualquer uma.
export const raceOptionsFor = (type?: CardType): readonly CardRace[] => {
	if (type === 'Spell Card') return CARD_RACES.spell
	if (type === 'Trap Card') return CARD_RACES.trap
	if (type) return CARD_RACES.monster
	return RACE_OPTIONS
}

// Aplica a mudança de um select e devolve um objeto NOVO, já sem os filtros
// que deixaram de fazer sentido. `raw` é o value do <select>; '' = "Todos".
export const setFilter = (
	filters: SelectableFilters,
	key: FilterKey,
	raw: string,
): SelectableFilters => {
	const next: SelectableFilters = { ...filters }

	if (raw === '') {
		delete next[key]
	} else if (key === 'level') {
		next.level = Number(raw)
	} else {
		// O valor vem de um <select> montado com as próprias listas de opções.
		Object.assign(next, { [key]: raw })
	}

	if (key === 'type') {
		if (isSpellOrTrap(next.type)) {
			delete next.attribute
			delete next.level
		}
		if (next.race && !raceOptionsFor(next.type).includes(next.race)) {
			delete next.race
		}
	}

	return next
}

// A ordenação não é um filtro: o botão "Filtros" não deve contá-la.
export const countActiveFilters = (filters: SelectableFilters): number =>
	Object.entries(filters).filter(
		([key, value]) => key !== 'sort' && value !== undefined,
	).length
