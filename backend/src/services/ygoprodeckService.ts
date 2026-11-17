import { YGOPRODECK_RawCard, YGOPRODECK_ApiResponse } from '../types/api'

const BASE_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'

/**
 * Serviço responsável pela comunicação com a API do YGOPRODECK.
 */
export const ygoprodeckService = {
	async fetchCardMetadata(id: string): Promise<YGOPRODECK_RawCard> {
		try {
			const response = await fetch(`${BASE_URL}?id=${id}`, {
				headers: {
					Accept: 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`YGOPRODECK API Error: ${response.status}`)
			}

			const json: YGOPRODECK_ApiResponse = await response.json()
			if (!json.data || json.data.length === 0) {
				throw new Error(`Card not found`)
			}

			return json.data[0]
		} catch (error) {
			console.error(`[YGOPRODECK Service] Error:`, error)
			throw error
		}
	},
}
