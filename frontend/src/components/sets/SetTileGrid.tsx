import SetTile from '@/components/sets/SetTile'
import { useIncrementalList } from '@/hooks/useIncrementalList'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import type { YgoSet } from '@/types/set'

export const SET_GRID_CLASSES =
	'grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

interface SetTileGridProps {
	sets: YgoSet[]
	title: string
	onSelect: (name: string) => void
}

// Grade de coleções que cresce em lotes conforme a pessoa rola, até a última.
// Quem usa deve remontar com `key` ao trocar a lista (ex.: o ano), para voltar
// ao primeiro lote.
const SetTileGrid = ({ sets, title, onSelect }: SetTileGridProps) => {
	const { visible, hasMore, loadMore } = useIncrementalList(sets)
	const sentinelRef = useIntersectionObserver({
		onIntersect: loadMore,
		enabled: hasMore,
	})

	return (
		<>
			<h2 className='font-display text-xl font-semibold text-ink'>{title}</h2>
			<ul aria-label={title} className={SET_GRID_CLASSES}>
				{visible.map((set) => (
					<li key={set.set_name}>
						<SetTile set={set} onSelect={onSelect} />
					</li>
				))}
			</ul>
			{/* A key muda a cada lote: o sentinel é recriado e o observer reavalia se
			    ele ainda está visível. Sem isso, um lote que não empurra o sentinel
			    para fora da tela deixaria o scroll travado. */}
			{hasMore && <div key={visible.length} ref={sentinelRef} />}
			<p role='status' className='py-xl text-center text-sm text-ink-3'>
				{hasMore
					? ''
					: `Fim da lista · ${sets.length} ${sets.length === 1 ? 'coleção' : 'coleções'}`}
			</p>
		</>
	)
}

export default SetTileGrid
