import type { Exchange } from '@/types/exchange'

const url = 'https://api.frankfurter.dev/v1/latest?from=USD&to=BRL'

export const fetchUsdBrlRate = async (): Promise<number> => {
	try {
		const response = await fetch(url)

		if (!response.ok)
			throw new Error(
				`Erro ao fazer o câmbio: ${response.status} ${response.statusText}`,
			)

		const data: Exchange = await response.json()
		const coin = data?.rates?.BRL

		if (typeof coin !== 'number') throw new Error('Resposta inesperada da API')

		return coin
	} catch (error) {
		console.error('Falha na requisição dos câmbios', error)
		throw error instanceof Error
			? error
			: new Error('Erro desconhecido ao buscar os valores da API')
	}
}
