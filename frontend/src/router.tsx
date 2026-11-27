import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { authRouterContext } from './lib/auth'
import { routeTree } from './routeTree.gen'

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: 'intent',
		defaultPreloadStaleTime: 0,
		context: { auth: authRouterContext },
	})

	return router
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
