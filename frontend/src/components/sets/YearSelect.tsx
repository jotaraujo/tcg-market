import { ChevronDown } from 'lucide-react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface YearSelectProps {
	years: number[]
	// Sem ano escolhido = "Todos os anos"
	selected?: number
	onChange: (year?: number) => void
}

// O Radix Select não aceita value="" num item, então "todos" usa um valor
// reservado que só existe aqui dentro: para fora, continua sendo `undefined`.
const ALL = '__all__'

// Um único select no lugar de ~25 chips: a pílula tem o mesmo desenho dos
// filtros do marketplace e o Radix cuida de teclado, foco e leitor de tela.
const YearSelect = ({ years, selected, onChange }: YearSelectProps) => {
	const isActive = selected !== undefined

	return (
		<Select
			value={isActive ? String(selected) : ALL}
			onValueChange={(next) =>
				onChange(next === ALL ? undefined : Number(next))
			}
		>
			<SelectTrigger
				aria-label='Ano de lançamento'
				className={cn(
					'inline-flex h-11 w-fit shrink-0 cursor-pointer items-center gap-xs rounded-pill border px-md text-sm text-ink outline-hidden transition-[background-color,border-color] duration-(--dur-short) hover:bg-paper-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus data-[state=open]:bg-paper-3 md:h-10',
					isActive
						? 'border-primary bg-primary/15 font-medium'
						: 'border-rule bg-paper-2',
				)}
			>
				<span>{isActive ? `Ano: ${selected}` : 'Todos os anos'}</span>
				<ChevronDown
					aria-hidden='true'
					className='size-4 shrink-0 text-ink-2'
				/>
			</SelectTrigger>
			<SelectContent aria-label='Ano de lançamento'>
				<SelectItem value={ALL}>Todos os anos</SelectItem>
				{years.map((year) => (
					<SelectItem key={year} value={String(year)}>
						{year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default YearSelect
