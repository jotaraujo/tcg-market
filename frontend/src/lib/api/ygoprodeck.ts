import type { CardApiResponse } from '@/types/card'
import type { CardFilters } from '@/types/filters'
import { buildCardQuery } from '../buildCardQuery'

const BASE_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'

// Lê o corpo sem consumir o da resposta original (clone) e confere a mensagem
// da API; um 400 por parâmetro inválido continua sendo erro.
const isNoCardFoundError = async (response: Response): Promise<boolean> => {
	try {
		const body: { error?: string } = await response.clone().json()
		return body.error?.startsWith('No card matching') ?? false
	} catch {
		return false
	}
}

export const fetchCards = async (
	filters: CardFilters = {},
): Promise<CardApiResponse> => {
	const filterPages: CardFilters = {
		num: 20,
		offset: 0,
		...filters,
	}

	const query = buildCardQuery(filterPages)
	// Se não tiver algum filtro, busca tudo. Se tiver, monta com "?" e os parâmetros
	const url = query ? `${BASE_URL}?${query}` : BASE_URL

	try {
		const response = await fetch(url)

		if (!response.ok) {
			// Sem carta para a combinação de filtros a API responde 400, não uma lista
			// vazia. Isso é "nenhum resultado" (estado vazio), não falha de rede.
			if (response.status === 400 && (await isNoCardFoundError(response))) {
				return { data: [] }
			}

			throw new Error(
				`Erro ao buscar cartas: ${response.status} ${response.statusText}`,
			)
		}

		const data: CardApiResponse = await response.json()

		return data
	} catch (error) {
		console.error('Falha na requisição das cartas:', error)
		throw error instanceof Error
			? error
			: new Error('Erro desconhecido ao buscar cartas da API')
	}
}
