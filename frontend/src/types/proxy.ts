/**
 * Contrato do Proxy Backend (SSOT com backend/src/types/proxy.ts).
 * O frontend NUNCA fala com YGOPRODECK/JustTCG diretamente —
 * tudo passa pelo proxy em http://localhost:3001/api/tcg/:id.
 */

export interface UnifiedCardMetadata {
  id: string
  name: string
  type: string
  race: string
  attribute?: string
  level?: number
  atk?: number
  def?: number
  imageUrl: string
  currentPrice: string
}

export interface PriceHistoryEntry {
  date: string // ISO Date String
  price: number
}

export interface Printing {
  setCode: string
  setName: string
  rarity: string
}

export type PriceHistoryStatus = 'ok' | 'not_found' | 'no_match' | 'ambiguous' | 'unavailable'

export interface UnifiedCardResponse {
  metadata: UnifiedCardMetadata
  selectedPrinting: Printing | null
  printings: Printing[]
  priceHistory: PriceHistoryEntry[]
  priceHistoryStatus: PriceHistoryStatus
  source: 'proxy-v1' // Versão do contrato para facilitar futuras migrações
}