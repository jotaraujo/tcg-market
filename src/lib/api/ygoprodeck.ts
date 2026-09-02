import { buildCardQuery } from "../buildCardQuery"
import type { CardApiResponse } from "@/types/card"
import type { CardFilters } from "@/types/filters"

const BASE_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'

export const fetchCards = async (filters: CardFilters = {}): Promise<CardApiResponse> => {
  const filterPages: CardFilters = {
    num: 20,
    offset: 0,
    ...filters
  }
  
  const query = buildCardQuery(filterPages)
  // Se não tiver algum filtro, busca tudo. Se tiver, monta com "?" e os parâmetros
  const url = query ? `${BASE_URL}?${query}` : BASE_URL

  try {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Erro ao buscar cartas: ${response.status} ${response.statusText}`)
  }

  const data: CardApiResponse = await response.json()

  return data

  } catch(error) {
    console.error('Falha na requisição das cartas:', error)

    throw error instanceof Error ? error : new Error('Erro desconhecido ao buscar cartas da API')
  }
}



