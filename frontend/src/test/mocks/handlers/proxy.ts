import { HttpResponse, http } from 'msw'
import { cardsFixture } from '../fixtures/cards'
import { makeTcgResponse } from '../fixtures/tcg'

// O curinga `*` no começo faz o handler casar com qualquer host,
// então o teste não depende do valor de VITE_PROXY_URL no .env
export const proxyHandlers = [
	http.get('*/api/tcg/:id', ({ params, request }) => {
		const card = cardsFixture.find((item) => String(item.id) === params.id)

		if (!card) {
			return HttpResponse.json(
				{ error: `Carta com ID ${params.id} não encontrada` },
				{ status: 404 },
			)
		}

		const response = makeTcgResponse(card)

		// Impressão escolhida via ?setCode=&rarity= (igual ao proxy real)
		const searchParams = new URL(request.url).searchParams
		const setCode = searchParams.get('setCode')
		const rarity = searchParams.get('rarity')

		if (setCode || rarity) {
			const selected = response.printings.find(
				(printing) =>
					(!setCode || printing.setCode === setCode) &&
					(!rarity || printing.rarity === rarity),
			)
			return HttpResponse.json({
				...response,
				selectedPrinting: selected ?? null,
			})
		}

		return HttpResponse.json(response)
	}),
]
