import {
	JustTCG_ApiResponse,
	JustTCG_PriceEntry,
	YGOPRODECK_RawCard,
} from '../types/api'

/**
 * Serviço responsável pela comunicação com a API da JustTCG.
 */
export const justTcgService = {
	generateSlug(card: YGOPRODECK_RawCard): string {
		const normalize = (str: string) =>
			str
				.toLowerCase()
				.trim()
				.replace(/\s+/g, '-')
				.replace(/[^\w-]/g, '')

		const game = 'yugioh'
		const set = normalize(card.set_name)
		const name = normalize(card.name)
		const rarity = normalize(card.set_rarity)

		return `${game}-${set}-${name}-${rarity}`
	},

	async fetchPriceHistory(slug: string): Promise<JustTCG_PriceEntry[]> {
		const apiKey = process.env.JUSTTCG_API_KEY
		if (!apiKey) {
			throw new Error('JUSTTCG_API_KEY is not defined')
		}

		try {
			const response = await fetch(
				`https://api.justtcg.com/v2/cards/${slug}/prices`,
				{
					headers: {
						Authorization: `Bearer ${apiKey}`,
						'Content-Type': 'application/json',
					},
				},
			)

			if (response.status === 404) return []

			if (!response.ok) {
				throw new Error(`JustTCG API Error: ${response.status}`)
			}

			const json: JustTCG_ApiResponse = await response.json()
			return json.prices || []
		} catch (error) {
			console.error(`[JustTCG Service] Error:`, error)
			throw error
		}
	},
}
