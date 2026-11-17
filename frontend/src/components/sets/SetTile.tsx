import type { YgoSet } from '@/types/set'

interface SetTileProps {
	set: YgoSet
	onSelect: (name: string) => void
}

const formatMonthYear = (isoDay: string) =>
	new Date(`${isoDay}T00:00:00Z`).toLocaleDateString('pt-BR', {
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	})

// Cartão clicável de uma coleção. Quando a API não manda arte, o código ocupa o
// lugar dela e a altura do tile não muda.
const SetTile = ({ set, onSelect }: SetTileProps) => {
	return (
		<button
			type='button'
			onClick={() => onSelect(set.set_name)}
			className='flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-card border border-rule bg-panel text-left transition-colors duration-(--dur-short) hover:bg-paper-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'
		>
			<div className='grid aspect-square w-full place-items-center bg-paper-2'>
				{set.set_image ? (
					<img
						src={set.set_image}
						alt=''
						loading='lazy'
						decoding='async'
						className='size-full object-contain'
					/>
				) : (
					<span className='font-display text-lg font-semibold text-ink-2'>
						{set.set_code}
					</span>
				)}
			</div>
			<div className='flex flex-1 flex-col gap-2xs p-sm'>
				<span className='text-sm font-medium text-ink wrap-anywhere'>
					{set.set_name}
				</span>
				<span className='text-sm text-ink-2'>
					{set.set_code} · {set.num_of_cards} cartas
					{set.tcg_date && ` · ${formatMonthYear(set.tcg_date)}`}
				</span>
			</div>
		</button>
	)
}

export default SetTile
