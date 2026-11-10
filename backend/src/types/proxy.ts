import { JustTCG_PriceEntry } from './api'

export interface UnifiedCardMetadata {
	id: string
	name: string
	type: string
	race: string
	attribute: string
	level: number
	atk: number
	def: number
	imageUrl: string
	currentPrice: string
}

export interface UnifiedCardResponse {
	metadata: UnifiedCardMetadata
	priceHistory: JustTCG_PriceEntry[]
	source: 'proxy-v1' // Versão do contrato para facilitar futuras migrações
}
