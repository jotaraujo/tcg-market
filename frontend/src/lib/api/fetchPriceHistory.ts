import type { PriceHistory } from '@/types/priceHistory'

const BASE_URL = 'https://api.justtcg.com/v2/cards'

export const fetchPriceHistory = async (
	cardId: string,
): Promise<PriceHistory[]> => {
	try {

		const response = await fetch(`${BASE_URL}?id=${cardId}`, {
			headers: {
				'x-api-key': `${import.meta.env.VITE_JUSTTCG_API_KEY}`,
			},
		})

		if (!response.ok) {
			throw new Error(
				`JustTCG API error: ${response.status} ${response.statusText}`,
			)
		}

		const data = await response.json()
		const history = data.data?.[0]?.variants?.[0]?.markets?.[0]?.price_history

    if (!history) {
      throw new Error('Price history not available for this card')
    }

		// JustTCG typically returns an array of price points.
		// We map the response to our internal PriceHistoryEntry format.
		// Assuming response format is [{ date: "...", price: ... }, ...]
		return history.map((point: { t: number; p: number }) => ({
			date: new Date(point.t * 1000).toISOString(),
			price: point.p,
		}))
	} catch (error) {
		console.error('Error fetching price history for card:', cardId, error)
		throw error instanceof Error
			? error
			: new Error('Unknown error fetching price history')
	}
}
