import { createFileRoute } from '@tanstack/react-router'
import CardDetail from '@/pages/CardDetail'

export const Route = createFileRoute('/card/$id')({
	validateSearch: (
		search: Record<string, unknown>,
	): { setCode?: string; rarity?: string } => ({
		setCode: typeof search.setCode === 'string' ? search.setCode : undefined,
		rarity: typeof search.rarity === 'string' ? search.rarity : undefined,
	}),
	component: CardDetail,
})
