import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { initAuth } from './lib/auth'
import { queryClient } from './lib/queryClient'
import { watchSessionLoss } from './lib/watchSessionLoss'
import { getRouter } from './router'
import './styles/globals.css'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource-variable/space-grotesk'

const router = getRouter()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

void initAuth()
// Vive o tempo todo da página, então o unsubscribe não é usado.
watchSessionLoss(router)

// Render the app
const rootElement = document.getElementById('root')!

ReactDOM.createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
)
