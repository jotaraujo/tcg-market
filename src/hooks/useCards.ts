import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCards } from "@/lib/api/ygoprodeck";
import { ONE_DAY_MS, ONE_WEEK_MS } from "@/lib/constants/time";
import type { CardFilters } from "@/types/filters";

const PAGE_SIZE = 20

export const useCards = (filters: CardFilters) => {
  return useInfiniteQuery({
    //A queryKey inclui o objeto de filtros inteiro
    //TanStack Query faz um 'hash' desse objeto para saber se algo mudou
    queryKey: ['cards', filters],
    queryFn: ({ pageParam }) => fetchCards({ ...filters, num: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // Se não possui mais páginas, retorna undefined
      if (!lastPage.meta || lastPage.meta.pages_remaining === 0) {
        return undefined
      }
      // Aqui retorna qual seria o offset da próxima página
      return lastPage.meta.next_page_offset
    },
    //A partir de agora, os dados ficam em cache por 1 dia
    //Se tentar buscar de novo em menos de 24h, ele usa o cache sem buscar na API
    staleTime: ONE_DAY_MS,
    //O cache será removido após 1 semana de inatividade
    gcTime: ONE_WEEK_MS
  })
}