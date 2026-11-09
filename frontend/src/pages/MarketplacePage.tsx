import { useState } from 'react'
import CardGrid from '#/components/cards/CardGrid'
import type { CardFilters } from '#/types/filters'
import { useSearchTerm } from '#/hooks/useSearchTerm'

const MarketplacePage = () => {
	const { term } = useSearchTerm()
	const [filters, setFilters] = useState<Omit<CardFilters, 'num' | 'offset'>>(
		{},
	)

  const combinedFilters: Omit<CardFilters, 'num' | 'offset'> = {
    ...filters,
    fname: term || undefined,
  }

	return (
		<main className='flex flex-col gap-6 w-full p-6'>
			<div className='flex flex-1 min-h-0 overflow-hidden'>
				<CardGrid filters={combinedFilters} />
			</div>
		</main>
	)
}

export default MarketplacePage
