import { useQuery } from '@tanstack/react-query'
import { ONE_DAY_MS, ONE_WEEK_MS } from '@/constants/time'
import { fetchSets } from '@/lib/api/ygoprodeck'
import type { YgoSet } from '@/types/set'

export const useSets = () => {
	return useQuery<YgoSet[]>({
		queryKey: ['sets'],
		queryFn: fetchSets,
		// A lista de coleções muda pouco: 1 dia fresco, 1 semana em cache
		staleTime: ONE_DAY_MS,
		gcTime: ONE_WEEK_MS,
	})
}
