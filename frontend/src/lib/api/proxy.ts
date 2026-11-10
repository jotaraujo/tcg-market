/**
 * Camada de acesso a dados (SEAM).
 *
 * O frontend NUNCA chama YGOPRODECK/JustTCG diretamente.
 * Tudo passa pelo Proxy Backend em http://localhost:3001/api/tcg/:id,
 * que orquestra as duas APIs e devolve um único contrato (UnifiedCardResponse).
 *
 * Para trocar a fonte de dados no futuro (ex: Supabase snapshots),
 * basta alterar este módulo — nenhum componente muda.
 */

import type { UnifiedCardResponse } from '@/types/proxy'

const PROXY_BASE =
  (import.meta.env.VITE_PROXY_URL as string) || 'http://localhost:3001'

export const fetchCardFullData = async (
  cardId: string,
): Promise<UnifiedCardResponse> => {
  const response = await fetch(`${PROXY_BASE}/api/tcg/${cardId}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Carta com ID ${cardId} não encontrada`)
    }
    throw new Error(`Proxy error: ${response.status} ${response.statusText}`)
  }

  const json: UnifiedCardResponse = await response.json()
  return json
}