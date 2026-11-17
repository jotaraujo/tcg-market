import { cn } from '@/lib/utils'

interface YearChipsProps {
	years: number[]
	// Sem ano escolhido = "Todos"
	selected?: number
	onChange: (year?: number) => void
}

const chipClasses = (active: boolean) =>
	cn(
		'inline-flex h-10 shrink-0 cursor-pointer items-center rounded-pill border px-md text-sm text-ink transition-[background-color,border-color] duration-(--dur-short) hover:bg-paper-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
		active
			? 'border-primary bg-primary/15 font-medium'
			: 'border-rule bg-paper-2',
	)

const YearChips = ({ years, selected, onChange }: YearChipsProps) => {
	return (
		<div
			role='group'
			aria-label='Ano de lançamento'
			className='flex flex-wrap gap-xs'
		>
			<button
				type='button'
				aria-pressed={selected === undefined}
				onClick={() => onChange(undefined)}
				className={chipClasses(selected === undefined)}
			>
				Todos
			</button>
			{years.map((year) => (
				<button
					key={year}
					type='button'
					aria-pressed={selected === year}
					onClick={() => onChange(year)}
					className={chipClasses(selected === year)}
				>
					{year}
				</button>
			))}
		</div>
	)
}

export default YearChips
