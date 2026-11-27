import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/lib/routeGuards'
import ProfilePage from '@/pages/ProfilePage'

export const Route = createFileRoute('/profile')({
	beforeLoad: requireAuth,
	component: ProfileRoute,
})

function ProfileRoute() {
	return <ProfilePage />
}
