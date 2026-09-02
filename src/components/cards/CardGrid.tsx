import { useCards } from '@/hooks/useCards'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import CardItem from './CardItem'
import type { CardFilters } from '@/types/filters'

interface CardGridProps {
	filters: Omit<CardFilters, 'num' | 'offset'>
}

const CardGrid = ({ filters }: CardGridProps) => {
	const {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useCards(filters)

	const sentinelRef = useIntersectionObserver({
		onIntersect: fetchNextPage,
		enabled: hasNextPage,
	})

	if (isLoading) {
		return <p className='p-2xs text-center text-muted'>Carregando cartas...</p>
	}

	if (isError) {
		return (
			<p className='p-2xs text-center text-danger'>
				{error?.message ?? 'Algo deu errado ao buscar as cartas.'}
			</p>
		)
	}

	const cards = data?.pages.flatMap((page) => page.data) ?? []

	if (cards.length === 0) {
		return (
			<p className='p-2xs text-center text-muted'>Nenhuma carta encontrada.</p>
		)
	}

	return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-2 gap-md sm:grid-cols-5 md:grid-cols-6'>
        {cards.map((card) => (
          <CardItem key={card.id} card={card} image={card.card_images[0]}/>
        ))}
      </div>

      
    {hasNextPage && (
      <div ref={sentinelRef} className='flex justify-center py-xs'>
        {isFetchingNextPage && <span className='text-base text-muted'>Carregando mais cartas...</span>}
      </div>
    )}
    </div>
  )
}

export default CardGrid
