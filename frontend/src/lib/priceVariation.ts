import type { PriceHistoryEntry } from '@/types/proxy'

export interface PriceVariation {
	// Variação percentual, arredondada a 1 casa (a mesma que aparece na tela)
	percent: number
	direction: 'up' | 'down' | 'flat'
}

// Variação do primeiro ao último ponto do histórico (o histórico vem em ordem
// cronológica, como o gráfico já assume). Sem pelo menos 2 pontos, ou com o
// primeiro preço zerado, não há base de comparação: devolve null em vez de
// inventar um número.
export const getPriceVariation = (
	history: PriceHistoryEntry[],
): PriceVariation | null => {
	if (history.length < 2) return null

	const first = history[0].price
	const last = history[history.length - 1].price
	if (!(first > 0)) return null

	const percent = Math.round(((last - first) / first) * 1000) / 10
	const direction = percent > 0 ? 'up' : percent < 0 ? 'down' : 'flat'

	return { percent, direction }
}
