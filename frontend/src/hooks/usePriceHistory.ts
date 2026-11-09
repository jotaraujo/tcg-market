import { useQuery } from "@tanstack/react-query";
import { fetchPriceHistory } from "@/lib/api/fetchPriceHistory";
import { ONE_HOUR_MS, ONE_DAY_MS } from '@/constants/time'
import type { PriceHistory } from "@/types/priceHistory";

export const usePriceHistory = (cardId: string | undefined) => {
  return useQuery<PriceHistory[]>({
    queryKey: ['priceHistory', cardId],
    queryFn: () => fetchPriceHistory(cardId!), // O "!" diz ao TS que temos certeza que o id existe aqui
    enabled: !!cardId, // SÓ executa a busca se o cardId existir (evita erros de undefined)
    staleTime: ONE_HOUR_MS * 6, // Cache por 6 horas (opcional, mas recomendado para economizar quota)
    gcTime: ONE_DAY_MS
  })
}