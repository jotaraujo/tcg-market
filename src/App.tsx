import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const App = () => {
	return (
    <QueryClientProvider client={queryClient}>
      <div>
      </div>
    </QueryClientProvider>
  )
}

export default App
