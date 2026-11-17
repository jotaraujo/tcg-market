import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { fetchCards, fetchSets } from '@/lib/api/ygoprodeck'
import { SETS_URL, setsFixture } from '@/test/mocks/fixtures/sets'
import { server } from '@/test/mocks/server'

const CARDINFO_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'

describe('fetchCards', () => {
	it('should return an empty list when the API finds no card for the query', async () => {
		// A YGOPRODECK responde 400 (e não 200 com lista vazia) quando nenhuma
		// carta casa com os filtros, ex.: atributo WATER + tipo Spell Card.
		server.use(
			http.get(CARDINFO_URL, () =>
				HttpResponse.json(
					{
						error:
							'No card matching your query was found in the database. Please see https://db.ygoprodeck.com/api-guide/ for syntax usage.',
					},
					{ status: 400 },
				),
			),
		)

		const response = await fetchCards({
			attribute: 'WATER',
			type: 'Spell Card',
		})

		expect(response.data).toEqual([])
	})

	it('should still throw on other HTTP errors', async () => {
		server.use(
			http.get(CARDINFO_URL, () =>
				HttpResponse.json({ error: 'boom' }, { status: 500 }),
			),
		)

		await expect(fetchCards()).rejects.toThrow(/500/)
	})

	it('should still throw on a 400 that is not the "no card" answer', async () => {
		server.use(
			http.get(CARDINFO_URL, () =>
				HttpResponse.json({ error: 'Invalid parameter' }, { status: 400 }),
			),
		)

		await expect(fetchCards()).rejects.toThrow(/400/)
	})

	it('should send the filters as query params', async () => {
		let search = ''
		server.use(
			http.get(CARDINFO_URL, ({ request }) => {
				search = new URL(request.url).search
				return HttpResponse.json({ data: [] })
			}),
		)

		await fetchCards({ attribute: 'WATER', level: 4, sort: 'atk' })

		expect(search).toContain('attribute=WATER')
		expect(search).toContain('level=4')
		expect(search).toContain('sort=atk')
	})
})

describe('fetchSets', () => {
	it('should return the sets list', async () => {
		await expect(fetchSets()).resolves.toEqual(setsFixture)
	})

	it('should throw when the API answers with an error status', async () => {
		server.use(
			http.get(SETS_URL, () => new HttpResponse(null, { status: 500 })),
		)

		await expect(fetchSets()).rejects.toThrow('Erro ao buscar coleções')
	})
})
