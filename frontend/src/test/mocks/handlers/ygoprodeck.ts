import { HttpResponse, http } from 'msw'
import type { CardApiResponse } from '@/types/card'
import { cardsFixture } from '../fixtures/cards'
import { SETS_URL, setsFixture } from '../fixtures/sets'

const DEFAULT_PAGE_SIZE = 20

export const ygoprodeckHandlers = [
	http.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', ({ request }) => {
		const params = new URL(request.url).searchParams
		const offset = Number(params.get('offset') ?? 0)
		const num = Number(params.get('num') ?? DEFAULT_PAGE_SIZE)

		// Filtro por nome, igual ao `fname` da busca real (parte do nome, sem caixa)
		// Filtro por coleção: o `cardset` da API é o NOME da coleção
		const cardset = params.get('cardset')
		const inSet = cardset
			? cardsFixture.filter((card) =>
					card.card_sets.some((set) => set.set_name === cardset),
				)
			: cardsFixture

		// A API responde 400 (e não lista vazia) quando nada casa com o filtro
		if (cardset && inSet.length === 0) {
			return HttpResponse.json(
				{ error: 'No card matching your query was found in the database.' },
				{ status: 400 },
			)
		}

		const fname = params.get('fname')?.toLowerCase()
		const matching = fname
			? inSet.filter((card) => card.name.toLowerCase().includes(fname))
			: inSet

		const data = matching.slice(offset, offset + num)
		const nextOffset = offset + num
		const rowsRemaining = Math.max(matching.length - nextOffset, 0)

		// Em 45 cartas com num=20: offset 0 → 2 páginas restantes,
		// offset 20 → 1, offset 40 → 0 (o useCards para de buscar em 0)
		const body: CardApiResponse = {
			data,
			meta: {
				current_rows: data.length,
				total_rows: matching.length,
				rows_remaining: rowsRemaining,
				total_pages: Math.ceil(matching.length / num),
				pages_remaining: Math.ceil(rowsRemaining / num),
				next_page_offset: nextOffset,
				prev_page_offset: Math.max(offset - num, 0),
			},
		}

		return HttpResponse.json(body)
	}),
	http.get(SETS_URL, () => HttpResponse.json(setsFixture)),
]
