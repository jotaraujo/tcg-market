import { Link } from '@tanstack/react-router'
import { useCards } from '@/hooks/useCards'
import { useExchange } from '@/hooks/useExchange'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { getSetPrinting } from '@/lib/sets'
import type { CardFilters } from '@/types/filters'
import ErrorState from '../ui/ErrorState'
import CardItem from './CardItem'
import CardSkeleton from './CardSkeleton'

interface CardGridProps {
	// Aqui cria um novo tipo CardFilters sem as propriedades 'num' e 'offset'
	filters: Omit<CardFilters, 'num' | 'offset'>
}

// Colunas crescem de forma gradual: o nome da carta precisa de largura para
// ser lido. Compartilhado entre o grid, o skeleton e a linha da próxima página.
const GRID_CLASSES =
	'grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

// Cartas da primeira dobra (1ª ou 2ª linha, dependendo da largura) carregam a
// imagem na hora; o resto fica lazy.
const PRIORITY_COUNT = 6

const SKELETON_COUNT = 12

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

	const { data: rate, isPending } = useExchange()

	// Sem containerRef: este container cresce até o fim do conteúdo
	// e quem rola é o <main> do layout. Com root = viewport (padrão), o
	// IntersectionObserver já respeita o recorte dos ancestrais com scroll; com
	// o container como root o sentinel ficava "visível" para sempre.
	const sentinelRef = useIntersectionObserver({
		onIntersect: fetchNextPage,
		// Desligado durante a busca: ao terminar, o observer é recriado e reavalia o
		// sentinel (ver teste). Também evita pedir a mesma página duas vezes.
		enabled: hasNextPage && !isFetchingNextPage,
	})

	if (isLoading || isPending) {
		// Sem padding próprio: a página (MarketplacePage) já aplica p-6. Manter o
		// mesmo espaçamento do grid carregado evita deslocamento na troca.
		return (
			<div
				className='flex-1 min-h-0 overflow-y-auto'
				aria-busy='true'
				aria-label='Carregando cartas'
			>
				<div className={`${GRID_CLASSES} mt-2`}>
					{Array.from({ length: SKELETON_COUNT }).map((_, index) => (
						<CardSkeleton key={index} />
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
			<div className='flex-1 flex flex-col items-center justify-center gap-xs p-xl text-center'>
				<p className='text-base font-medium text-ink'>
					Nenhuma carta encontrada.
				</p>
				<p className='text-sm text-text-foreground'>
					Tente outro nome ou limpe a busca.
				</p>
			</div>
		)
	}

	return (
		<div
			className='flex-1 min-h-0 overflow-y-auto'
			aria-busy={isFetchingNextPage}
		>
			<ul className={`${GRID_CLASSES} mt-2`}>
				{cards.map((card, index) => (
					<li key={card.id}>
						<Link
							to='/card/$id'
							params={{ id: String(card.id) }}
							// Dentro de uma coleção, o detalhe abre na impressão dela
							search={getSetPrinting(card, filters.cardset) ?? {}}
							className='card-link block h-full rounded-card'
						>
							<CardItem
								card={card}
								image={card.card_images[0]}
								rate={rate}
								priority={index < PRIORITY_COUNT}
							/>
						</Link>
					</li>
				))}
				{/* Próxima página: skeleton no lugar do spinner, o layout já é conhecido */}
				{isFetchingNextPage &&
					Array.from({ length: PRIORITY_COUNT }).map((_, index) => (
						<li key={`next-${index}`} aria-hidden='true'>
							<CardSkeleton />
						</li>
					))}
			</ul>

			{hasNextPage && <div ref={sentinelRef} className='h-xs' />}

			{/* Região viva: anuncia o carregamento e o fim da lista */}
			<p role='status' className='py-5xl text-center text-sm text-ink-3'>
				{isFetchingNextPage && 'Carregando mais cartas…'}
				{!hasNextPage && `Fim da lista · ${cards.length} cartas`}
			</p>
		</div>
	)
}

export default CardGrid
