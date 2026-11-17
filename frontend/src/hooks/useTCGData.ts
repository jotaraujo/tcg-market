import { useQuery } from '@tanstack/react-query'
import { fetchCardFullData, type PrintingParams } from '@/lib/api/proxy'
import { ONE_DAY_MS } from '@/constants/time'
import type { UnifiedCardResponse } from '@/types/proxy'

/**
 * Hook único que busca metadados + histórico de preços via Proxy Backend.
 *
 * Por que um só hook em vez de useCardById + usePriceHistory?
 * - Apenas UMA requisição HTTP (o proxy orquestra YGOPRODECK + JustTCG).
 * - Cache centralizado em uma única queryKey.
 * - Se um dos bancos de dados falhar, o proxy devolve o que puder
 *   (ex: metadados OK, histórico vazio) em vez de derrubar a página inteira.
 */
export const useTCGData = (
	cardId: string | undefined,
	printing?: PrintingParams,
) => {
	return useQuery<UnifiedCardResponse>({
		queryKey: [
			'tcg',
			cardId,
			printing?.setCode ?? null,
			printing?.rarity ?? null,
		],
		queryFn: ({ signal }) => fetchCardFullData(cardId!, printing, signal),
		enabled: !!cardId,
		staleTime: ONE_DAY_MS,
		gcTime: ONE_DAY_MS * 2,
		retry: 2, // retry limitado para não travar em caso de API instável
		placeholderData: (prev) =>
			// Mantém os dados ao trocar de impressão, mas NÃO ao trocar de carta
			prev?.metadata.id === cardId ? prev : undefined,
	})
}
