import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/lib/routeGuards'
import FavoritesPage from '@/pages/FavoritesPage'

export const Route = createFileRoute('/favorites')({
	beforeLoad: requireAuth,
	component: FavoritesRoute,
})

function FavoritesRoute() {
	return <FavoritesPage />
}
