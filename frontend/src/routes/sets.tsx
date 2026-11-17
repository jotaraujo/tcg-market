import { createFileRoute } from '@tanstack/react-router'
import SetsPage from '@/pages/SetsPage'

export const Route = createFileRoute('/sets')({
	// A coleção escolhida fica na URL: recarregar, voltar e compartilhar mantêm
	validateSearch: (search: Record<string, unknown>): { set?: string } => ({
		set: typeof search.set === 'string' ? search.set : undefined,
	}),
	component: SetsRoute,
})

function SetsRoute() {
	const { set } = Route.useSearch()
	const navigate = Route.useNavigate()

	return (
		<SetsPage
			selectedName={set}
			// Empilha no histórico: voltar leva à tela de atalhos
			onSelectSet={(name) => navigate({ search: { set: name } })}
		/>
	)
}
