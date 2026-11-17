import { useState } from 'react'
import CardGrid from '@/components/cards/CardGrid'
import FilterBar from '@/components/filters/FilterBar'
import { useSearchTerm } from '@/hooks/useSearchTerm'
import type { CardFilters, SelectableFilters } from '@/types/filters'

const MarketplacePage = () => {
	const { term } = useSearchTerm()
	// Só os filtros escolhidos na barra; o termo de busca vem do useSearchTerm
	// e os dois se juntam abaixo num único objeto para o useCards.
	const [filters, setFilters] = useState<SelectableFilters>({})

	const combinedFilters: Omit<CardFilters, 'num' | 'offset'> = {
		...filters,
		fname: term || undefined,
	}

	return (
		<section className='flex flex-col gap-lg w-full p-lg'>
			<h1 className='font-display text-2xl font-semibold tracking-tight text-ink'>
				Mercado
			</h1>
			<FilterBar filters={filters} onChange={setFilters} />
			<div className='flex flex-1 min-h-0 overflow-hidden'>
				<CardGrid filters={combinedFilters} />
			</div>
		</section>
	)
}

export default MarketplacePage
