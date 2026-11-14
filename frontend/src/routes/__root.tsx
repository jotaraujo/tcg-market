import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from '@/components/layout/Header'

export const Route = createRootRoute({
	component: RootLayout,
})

function RootLayout() {
	return (
		<div className='flex flex-col h-screen overflow-hidden'>
			<main className='flex-1 overflow-y-auto scrollbar-hide'>
				<Header />
				<Outlet />
			</main>

			{process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
		</div>
	)
}
