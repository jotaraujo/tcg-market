import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import type { YgoSet } from '@/types/set'

interface SetComboboxProps {
	// Já filtrada pelo pai (ano escolhido, sem coleções não lançadas)
	sets: YgoSet[]
	value?: YgoSet
	onSelect: (name: string) => void
}

// O filtro padrão do cmdk é "fuzzy" (letras espalhadas): "LOB" traria ~130
// coleções que só têm L, O e B em algum lugar. Aqui vale o trecho digitado.
const matchesText = (value: string, search: string) =>
	value.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0

// Busca por nome ou código. O `value` de cada item junta os dois para o filtro
// do cmdk casar em qualquer um; a escolha usa o nome (único), não esse texto.
const SetCombobox = ({ sets, value, onSelect }: SetComboboxProps) => {
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type='button'
					role='combobox'
					aria-label='Buscar coleção'
					aria-expanded={open}
					className='inline-flex h-11 w-full cursor-pointer items-center justify-between gap-xs rounded-pill border border-rule bg-paper-2 px-md text-left text-sm text-ink transition-colors duration-(--dur-short) hover:bg-paper-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:h-10 md:max-w-96'
				>
					<span className={value ? 'truncate' : 'truncate text-ink-2'}>
						{value?.set_name ?? 'Buscar coleção por nome ou código…'}
					</span>
					<ChevronDown
						aria-hidden='true'
						className='size-4 shrink-0 text-ink-2'
					/>
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<Command filter={matchesText}>
					<CommandInput placeholder='Nome ou código da coleção' />
					<CommandList>
						<CommandEmpty>Nenhuma coleção encontrada.</CommandEmpty>
						{sets.map((set) => (
							<CommandItem
								key={set.set_name}
								value={`${set.set_name} ${set.set_code}`}
								onSelect={() => {
									onSelect(set.set_name)
									setOpen(false)
								}}
							>
								<span className='truncate'>{set.set_name}</span>
								<span className='ml-auto shrink-0 text-ink-2'>
									{set.set_code}
								</span>
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default SetCombobox
