import { QueryClient } from '@tanstack/react-query'

// Instância única: fora do React (por exemplo, no logout) é ela que precisa
// ser limpa, e o QueryClientProvider do main.tsx usa esta mesma.
export const queryClient = new QueryClient()
