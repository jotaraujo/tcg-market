import { HttpResponse, http } from 'msw'
import { exchangeFixture } from '../fixtures/exchange'

export const exchangeHandlers = [
	http.get('https://api.frankfurter.dev/v1/latest?from=USD&to=BRL', () =>
		HttpResponse.json(exchangeFixture),
	),
]
