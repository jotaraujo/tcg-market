import { JustTCG_Card, JustTCG_PriceEntry, PriceHistoryStatus } from './api'

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

export interface Printing {
	setCode: string
	setName: string
	rarity: string
}

export type SelectedPrinting = Printing

export interface UnifiedCardResponse {
	metadata: UnifiedCardMetadata
	selectedPrinting: Printing | null
	printings: Printing[]
	priceHistory: JustTCG_PriceEntry[]
	priceHistoryStatus: PriceHistoryStatus
	source: 'proxy-v1' // Versão do contrato para facilitar futuras migrações
}
