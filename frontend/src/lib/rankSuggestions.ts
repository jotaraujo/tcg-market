import type { Card } from '@/types/card'

// A API devolve as cartas em ordem alfabética, e `fname` casa em qualquer parte
// do nome. Para "dark", "A Dark Magician" viria antes de "Dark Magician".
// Aqui os nomes que COMEÇAM com o termo sobem, e a ordem original se mantém
// dentro de cada grupo (Array.prototype.sort é estável).
export const rankSuggestions = (
	cards: Card[],
	term: string,
	limit: number,
): Card[] => {
	const needle = term.trim().toLowerCase()
	if (!needle) return cards.slice(0, limit)

	const startsWithTerm = (card: Card) =>
		card.name.toLowerCase().startsWith(needle) ? 0 : 1

	return [...cards]
		.sort((a, b) => startsWithTerm(a) - startsWithTerm(b))
		.slice(0, limit)
}
