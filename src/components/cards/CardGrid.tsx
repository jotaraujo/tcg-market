import { useRef } from 'react'
import { useCards } from '@/hooks/useCards'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import CardItem from './CardItem'
import type { CardFilters } from '@/types/filters'
import ErrorState from '../ui/ErrorState'
import LoadingState from '../ui/LoadingState'
import { Loader2 } from 'lucide-react'
import CardSkeleton from './CardSkeleton'

interface CardGridProps {
	// Aqui cria um novo tipo CardFilters sem as propriedades 'num' e 'offset'
	filters: Omit<CardFilters, 'num' | 'offset'>
}

const CardGrid = ({ filters }: CardGridProps) => {
	const {
		data,
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useCards(filters)

	// Ref para o container de scroll que será passado ao hook
	const containerRef = useRef<HTMLDivElement>(null)

	const sentinelRef = useIntersectionObserver({
		onIntersect: fetchNextPage,
		enabled: hasNextPage,
		containerRef, // passa o container para observar relative a ele, não viewport
	})

	if (isLoading) {
		return (
			<div className='flex-1 min-h-0 overflow-y-auto p-6'>
				<div className='grid grid-cols-2 gap-md sm:grid-cols-5 md:grid-cols-6'>
					{Array.from({ length: 10 }).map((_, index) => (
						<CardSkeleton key={index}/>
					))}
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex-1 min-h-0 overflow-y-auto flex items-center justify-center'>
				<ErrorState
					message={error?.message ?? 'Algo deu errado ao buscar as cartas.'}
					onRetry={refetch}
					isRetrying={isFetching}
				/>
			</div>
		)
	}

	const cards = data?.pages.flatMap((page) => page.data) ?? []

	if (cards.length === 0) {
		return (
			<p className='p-2xs text-center text-muted'>Nenhuma carta encontrada.</p>
		)
	}

	return (
		<div ref={containerRef} className='flex-1 min-h-0 overflow-y-auto'>
			<div className='grid grid-cols-2 gap-md sm:grid-cols-5 md:grid-cols-6'>
				{cards.map((card) => (
					<CardItem key={card.id} card={card} image={card.card_images[0]} />
				))}
			</div>

			{hasNextPage && (
				<div ref={sentinelRef} className='flex justify-center py-xs'>
					{isFetchingNextPage && (
						<Loader2 className='animate-spin h-8 w-8 text-primary' />
					)}
				</div>
			)}
		</div>
	)
}

export default CardGrid
