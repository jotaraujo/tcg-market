import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	createMemoryHistory,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { authRouterContext } from '@/lib/auth'
import { routeTree } from '@/routeTree.gen'
import type { AuthRouterContext } from '@/types/auth'

export const renderApp = (
	path: string,
	options: {
		queryClient?: QueryClient
		auth?: Partial<AuthRouterContext>
	} = {},
) => {
	const queryClient =
		options.queryClient ??
		new QueryClient({ defaultOptions: { queries: { retry: false } } })
	// O jsdom não implementa window.scrollTo, que o roteador chama ao navegar.
	vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
	const router = createRouter({
		routeTree,
		context: { auth: { ...authRouterContext, ...options.auth } },
		history: createMemoryHistory({ initialEntries: [path] }),
	})

	return {
		router,
		queryClient,
		...render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>,
		),
	}
}
