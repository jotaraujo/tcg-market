import type { YgoSet } from '@/types/set'

interface SetHeaderProps {
	set: YgoSet
	onClear: () => void
}

const SetHeader = ({ set, onClear }: SetHeaderProps) => {
	const year = set.tcg_date?.slice(0, 4)

	return (
		<header className='flex flex-wrap items-center justify-between gap-md'>
			<div className='flex flex-col gap-2xs'>
				<h2 className='font-display text-xl font-semibold text-balance text-ink wrap-anywhere'>
					{set.set_name}
				</h2>
				<p className='text-sm text-ink-2'>
					{set.set_code} · {set.num_of_cards} cartas
					{year && ` · ${year}`}
				</p>
			</div>
			<button
				type='button'
				onClick={onClear}
				className='inline-flex h-10 cursor-pointer items-center rounded-pill border border-rule bg-paper-2 px-md text-sm text-ink transition-colors duration-(--dur-short) hover:bg-paper-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'
			>
				Trocar coleção
			</button>
		</header>
	)
}

export default SetHeader
