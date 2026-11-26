import { createFileRoute } from '@tanstack/react-router'
import AuthCallbackPage from '@/pages/AuthCallbackPage'

export const Route = createFileRoute('/auth/callback')({
	validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
		redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
	}),
	component: AuthCallbackRoute,
})

function AuthCallbackRoute() {
	const { redirect } = Route.useSearch()
	return <AuthCallbackPage redirect={redirect} />
}