import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'

export const renderWithClient = (ui: ReactElement) => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	})

	return {
		queryClient,
		...render(
			<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
		),
	}
}

// Abre a pílula de filtro (um Select do Radix) e escolhe uma opção da lista.
// `select` é o nome acessível da pílula ("Tipo"); `option`, o texto da opção.
export const chooseOption = async (
	user: ReturnType<typeof userEvent.setup>,
	select: string,
	option: string,
) => {
	await user.click(screen.getByRole('combobox', { name: select }))
	await user.click(await screen.findByRole('option', { name: option }))
}
