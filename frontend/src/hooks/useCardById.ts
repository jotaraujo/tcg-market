import { useQuery } from "@tanstack/react-query"
import type { Card, CardMidia } from "@/types/card"
import { fetchCardById } from "@/lib/api/ygoprodeck"
import { ONE_DAY_MS } from "@/constants/time"

export const useCardById = (cardId: string | undefined) => {
  return useQuery<Card & CardMidia>({
    // Chave única para cache: se mudarmos para outra carta, a chave muda e o cache limpa
    queryKey: ['card', cardId],
    // Função que vai ao servidor buscar o dado
    queryFn: () => fetchCardById(cardId!),
    // Não busca nada se cardId for undefined
    enabled: !!cardId,
    staleTime: ONE_DAY_MS,
    gcTime: ONE_DAY_MS * 2
  })
}