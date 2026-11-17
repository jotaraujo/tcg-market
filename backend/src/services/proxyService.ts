import { UnifiedCardResponse, SelectedPrinting, Printing } from '../types/proxy'
import { ygoprodeckService } from './ygoprodeckService'
import { justTcgService } from './justTcgService'
import {
	JustTCG_PriceEntry,
	PriceHistoryStatus,
	YGOPRODECK_CardSet,
} from '../types/api'

/**
 * Serviço Orquestrador (Proxy Service).
 * Responsável por coordenar as chamadas entre YGOPRODECK e JustTCG.
 */
const decodeHtml = (s: string) =>
	s
		.replace(/&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')

const toPrinting = (s: YGOPRODECK_CardSet): Printing => ({
	setCode: s.set_code,
	setName: decodeHtml(s.set_name),
	rarity: s.set_rarity,
})

const uniquePrintings = (sets: YGOPRODECK_CardSet[] = []): Printing[] => {
	const map = new Map<string, Printing>()
	for (const s of sets) {
		const key = `${s.set_code}|${s.set_rarity}`
		if (!map.has(key)) map.set(key, toPrinting(s))
	}
	return [...map.values()]
}

export const proxyService = {
	async getCardFullData(
		cardId: string,
		setCode?: string,
		rarity?: string,
	): Promise<UnifiedCardResponse> {
		// 1. Metadados (obrigatório): se falhar, a requisição inteira falha
		const rawCard = await ygoprodeckService.fetchCardMetadata(cardId)

		// 2. Impressão escolhida: a do ?setCode=, senão a primeira da lista
		const printings = uniquePrintings(rawCard.card_sets)

		const selected =
			rawCard.card_sets?.find(
				(s) => s.set_code === setCode && (!rarity || s.set_rarity === rarity),
			) ?? rawCard.card_sets?.[0]

		const selectedPrinting: Printing | null = selected
			? toPrinting(selected)
			: null

		// 3. Histórico de preços (opcional): falha vira status, não erro
		let priceHistory: JustTCG_PriceEntry[] = []
		let priceHistoryStatus: PriceHistoryStatus = 'not_found'

		if (selected) {
			try {
				const result = await justTcgService.fetchPriceHistory(
					selected.set_code,
					selected.set_rarity,
				)
				priceHistory = result.history
				priceHistoryStatus = result.status
			} catch (error) {
				console.error(
					`[Proxy Service] JustTCG falhou para ${selected.set_code}:`,
					error,
				)
				priceHistoryStatus = 'unavailable'
			}
		}

		// 4. Contrato do frontend (UnifiedCardResponse)
		return {
			metadata: {
				id: rawCard.id.toString(),
				name: rawCard.name,
				type: rawCard.type,
				race: rawCard.race,
				attribute: rawCard.attribute,
				level: rawCard.level,
				atk: rawCard.atk,
				def: rawCard.def,
				imageUrl: rawCard.card_images[0]?.image_url || '',
				currentPrice: rawCard.card_prices?.[0]?.tcgplayer_price || '',
			},
			selectedPrinting,
			printings,
			priceHistory,
			priceHistoryStatus,
			source: 'proxy-v1',
		}
	},
}
