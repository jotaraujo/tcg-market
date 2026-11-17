import { useQuery } from '@tanstack/react-query'
import { fetchUsdBrlRate } from '@/lib/api/exchange'
import { ONE_DAY_MS } from '@/constants/time'

export const useExchange = () => {
	return useQuery({
		queryKey: ['exchange', 'usd-brl'],
		queryFn: fetchUsdBrlRate,
		staleTime: ONE_DAY_MS,
		gcTime: ONE_DAY_MS * 2,
		retry: 2,
	})
}
