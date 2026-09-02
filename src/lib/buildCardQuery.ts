import type { CardFilters } from "@/types/filters";

export const buildCardQuery = (filters: CardFilters): string => {
  const params = new URLSearchParams()

  //Object.entries transforma o objeto em pares de array [chave, valor]
  //para poder iterar e testar cada filtro dinamicamente
  //isso evita condicionais fixas para cada possível filtro
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  })

  //toString() devolve pronto para usar na URL: 'attribute=water&lelvel=4'
  return params.toString()
}