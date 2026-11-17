import type { UnifiedCardMetadata } from '@/types/proxy'

export interface CardStat {
	label: string
	value: string | number
}

// Nomes de marcador da YGOPRODECK → seta exibida
const LINK_ARROWS: Record<string, string> = {
	'Top-Left': '↖',
	Top: '↑',
	'Top-Right': '↗',
	Left: '←',
	Right: '→',
	'Bottom-Left': '↙',
	Bottom: '↓',
	'Bottom-Right': '↘',
}

// Ordem fixa (como a grade 3x3 da carta), independente da ordem que a API mandar
const LINK_ARROW_ORDER = Object.keys(LINK_ARROWS)

const formatLinkMarkers = (markers: string[]) =>
	LINK_ARROW_ORDER.filter((marker) => markers.includes(marker))
		.map((marker) => LINK_ARROWS[marker])
		.join(' ')

/**
 * Decide quais stats o detalhe da carta mostra. Cada stat é decidido pela
 * característica da carta (é Link? Xyz? tem escala?) e não pelo tipo inteiro,
 * senão híbridos como "XYZ Pendulum Effect Monster" ficariam de fora.
 */
export const getCardStats = (metadata: UnifiedCardMetadata): CardStat[] => {
	const { type, atk, def, level, scale, linkval, linkmarkers } = metadata
	const stats: CardStat[] = []

	if (atk !== undefined) stats.push({ label: 'ATK', value: atk })

	// Monstro Link não tem DEF nem nível: mostra o valor Link e as setas
	if (type.includes('Link')) {
		if (linkval !== undefined) stats.push({ label: 'Link', value: linkval })
		if (linkmarkers?.length)
			stats.push({ label: 'Setas', value: formatLinkMarkers(linkmarkers) })
		return stats
	}

	if (def !== undefined) stats.push({ label: 'DEF', value: def })

	// Nível (ou Rank, em Xyz) e escala de Pêndulo dividem o mesmo card
	const labels: string[] = []
	const values: number[] = []
	if (level !== undefined) {
		labels.push(type.includes('XYZ') ? 'Rank' : 'Nível')
		values.push(level)
	}
	if (scale !== undefined) {
		labels.push('Escala')
		values.push(scale)
	}
	if (labels.length > 0)
		stats.push({
			label: labels.join(' / '),
			value: values.length === 1 ? values[0] : values.join(' / '),
		})

	return stats
}
