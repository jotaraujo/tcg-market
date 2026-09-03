import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from './components/layout/Container'

const queryClient = new QueryClient()

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Container />
		</QueryClientProvider>
	)
}

export default App
