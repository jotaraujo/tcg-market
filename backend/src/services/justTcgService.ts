import {
	JustTCG_Card,
	JustTCG_PriceEntry,
	PriceHistoryStatus,
} from '../types/api'

const BASE_URL = 'https://api.justtcg.com/v1/cards'
const TTL_MS = 6 * 60 * 60 * 1000 // 6h: cota de 100 req/dia no plano Free

const cache = new Map<string, { expires: number; cards: JustTCG_Card[] }>()
const normalize = (s: string | null) => (s ?? '').trim().toLowerCase()

async function fetchCardsByNumber(number: string): Promise<JustTCG_Card[]> {
	const hit = cache.get(number)
	if (hit && hit.expires > Date.now()) return hit.cards

	const apiKey = process.env.JUSTTCG_API_KEY
	if (!apiKey) throw new Error('JUSTTCG_API_KEY is not defined')

	const params = new URLSearchParams({
		game: 'YuGiOh',
		number,
		include_price_history: 'true',
		priceHistoryDuration: '30d',
	})
	console.log(`[JustTCG] cache miss para ${number}`)
	const res = await fetch(`${BASE_URL}?${params}`, {
		headers: { 'x-api-key': apiKey },
	})
	const json = (await res.json()) as { data?: JustTCG_Card[]; error?: string }
	if (!res.ok || json.error)
		throw new Error(
			`JustTCG ${res.status}: ${json.error ?? 'erro desconhecido'}`,
		)

	const cards = json.data ?? []
	cache.set(number, { expires: Date.now() + TTL_MS, cards }) // guarda também o resultado vazio
	return cards
}

export interface PriceHistoryResult {
	status: PriceHistoryStatus
	printing?: string
	history: JustTCG_PriceEntry[]
}

const withoutLanguage = (code: string) =>
	code.replace(/^([A-Z0-9]+)-[A-Z]{2}(\d+)$/, '$1-$2')

export const justTcgService = {
	async fetchPriceHistory(
		setCode: string,
		rarity: string,
		printing = 'Unlimited',
	): Promise<PriceHistoryResult> {
		let cards = await fetchCardsByNumber(setCode)
		if (cards.length === 0) {
			const alt = withoutLanguage(setCode)
			if (alt !== setCode) cards = await fetchCardsByNumber(alt)
		}
		if (cards.length === 0) return { status: 'not_found', history: [] }

		console.log('[JustTCG Debug]', {
			setCode,
			rarity,
			found: cards.map((c) => ({
				uuid: c.uuid,
				name: c.name,
				set: c.set,
				number: c.number,
				rarity: c.rarity,
				variants: c.variants.length,
			})),
		})

		const matches = cards.filter(
			(c) => normalize(c.rarity) === normalize(rarity),
		)
		if (matches.length === 0) return { status: 'no_match', history: [] }
		if (matches.length > 1) return { status: 'ambiguous', history: [] }

		const nearMint = matches[0].variants.filter(
			(v) => v.condition === 'Near Mint',
		)
		const variant = nearMint.find((v) => v.printing === printing) ?? nearMint[0]
		if (!variant) return { status: 'no_match', history: [] }

		return {
			status: 'ok',
			printing: variant.printing,
			history: (variant.priceHistory ?? []).map(({ t, p }) => ({
				date: new Date(t * 1000).toISOString().slice(0, 10),
				price: p,
			})),
		}
	},
}
