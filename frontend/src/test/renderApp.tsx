import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { routeTree } from '@/routeTree.gen'

export const renderApp = (
	path: string,
	options: { queryClient?: QueryClient } = {},
) => {
	const queryClient =
		options.queryClient ??
		new QueryClient({ defaultOptions: { queries: { retry: false } } })
	// O jsdom não implementa window.scrollTo, que o roteador chama ao navegar.
	vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
	const router = createRouter({
		routeTree,
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
