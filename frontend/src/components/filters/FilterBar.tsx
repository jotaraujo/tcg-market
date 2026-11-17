import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useId, useState } from 'react'
import {
	countActiveFilters,
	raceOptionsFor,
	setFilter,
} from '@/lib/filterRules'
import { CARD_TYPES } from '@/types/card'
import {
	ATTRIBUTE_OPTIONS,
	LEVEL_OPTIONS,
	type SelectableFilters,
	SORT_OPTIONS,
} from '@/types/filters'

interface FilterBarProps {
	filters: SelectableFilters
	onChange: (filters: SelectableFilters) => void
}

interface FilterSelectProps {
	label: string
	value: string
	onChange: (value: string) => void
	// Texto da opção vazia ("Todos", "Padrão")
	emptyLabel: string
	disabled?: boolean
	disabledReason?: string
	children: React.ReactNode
}

// <select> nativo de propósito: acessível por teclado sem código extra e, no
// celular, abre o seletor do sistema (melhor que um popover para 28 tipos).
const FilterSelect = ({
	label,
	value,
	onChange,
	emptyLabel,
	disabled = false,
	disabledReason,
	children,
}: FilterSelectProps) => {
	const id = useId()
	const isActive = value !== ''

	return (
		<div className='flex min-w-0 flex-col gap-2xs'>
			<label htmlFor={id} className='text-sm text-ink-2'>
				{label}
			</label>
			<div className='relative'>
				<select
					id={id}
					value={value}
					disabled={disabled}
					title={disabled ? disabledReason : undefined}
					onChange={(event) => onChange(event.target.value)}
					className={`h-11 w-full appearance-none rounded-input border bg-paper-2 pl-sm pr-xl text-sm text-ink [color-scheme:dark] transition-colors duration-(--dur-short) hover:bg-paper-3 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-paper-2 ${
						isActive ? 'border-primary' : 'border-rule'
					}`}
				>
					<option value=''>{emptyLabel}</option>
					{children}
				</select>
				<ChevronDown
					aria-hidden='true'
					className='pointer-events-none absolute right-sm top-1/2 size-4 -translate-y-1/2 text-ink-2'
				/>
			</div>
		</div>
	)
}

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
	const panelId = useId()
	const [isOpen, setIsOpen] = useState(false)

	const activeCount = countActiveFilters(filters)
	const hasAnyFilter = activeCount > 0 || filters.sort !== undefined
	const isSpellOrTrap =
		filters.type === 'Spell Card' || filters.type === 'Trap Card'

	const change = (key: keyof SelectableFilters) => (value: string) =>
		onChange(setFilter(filters, key, value))

	return (
		<div className='flex flex-col gap-sm'>
			{/* Mobile: os filtros ficam recolhidos atrás de um botão */}
			<button
				type='button'
				aria-expanded={isOpen}
				aria-controls={panelId}
				aria-label={
					activeCount > 0 ? `Filtros, ${activeCount} ativos` : 'Filtros'
				}
				onClick={() => setIsOpen((open) => !open)}
				className='flex h-11 w-fit items-center gap-xs rounded-input border border-rule bg-paper-2 px-sm text-sm text-ink transition-colors duration-(--dur-short) hover:bg-paper-3 md:hidden'
			>
				<SlidersHorizontal aria-hidden='true' className='size-4' />
				Filtros
				{activeCount > 0 && (
					<span
						aria-hidden='true'
						className='grid size-5 place-items-center rounded-pill bg-primary text-sm text-primary-foreground'
					>
						{activeCount}
					</span>
				)}
			</button>

			<div
				id={panelId}
				className={`${isOpen ? 'grid' : 'hidden'} grid-cols-2 gap-sm md:grid md:grid-cols-[repeat(5,minmax(0,1fr))_auto] md:items-end`}
			>
				<FilterSelect
					label='Tipo'
					value={filters.type ?? ''}
					onChange={change('type')}
					emptyLabel='Todos'
				>
					<optgroup label='Main Deck'>
						{CARD_TYPES.mainDeck.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</optgroup>
					<optgroup label='Extra Deck'>
						{CARD_TYPES.extraDeck.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</optgroup>
					<optgroup label='Outros'>
						{CARD_TYPES.otherTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</optgroup>
				</FilterSelect>

				<FilterSelect
					label='Atributo'
					value={filters.attribute ?? ''}
					onChange={change('attribute')}
					emptyLabel='Todos'
					disabled={isSpellOrTrap}
					disabledReason='Spell e Trap não têm atributo'
				>
					{ATTRIBUTE_OPTIONS.map((attribute) => (
						<option key={attribute} value={attribute}>
							{attribute}
						</option>
					))}
				</FilterSelect>

				<FilterSelect
					label='Raça'
					value={filters.race ?? ''}
					onChange={change('race')}
					emptyLabel='Todas'
				>
					{raceOptionsFor(filters.type).map((race) => (
						<option key={race} value={race}>
							{race}
						</option>
					))}
				</FilterSelect>

				<FilterSelect
					label='Nível'
					value={filters.level === undefined ? '' : String(filters.level)}
					onChange={change('level')}
					emptyLabel='Todos'
					disabled={isSpellOrTrap}
					disabledReason='Spell e Trap não têm nível'
				>
					{LEVEL_OPTIONS.map((level) => (
						<option key={level} value={level}>
							{level}
						</option>
					))}
				</FilterSelect>

				<FilterSelect
					label='Ordenar por'
					value={filters.sort ?? ''}
					onChange={change('sort')}
					emptyLabel='Padrão'
				>
					{SORT_OPTIONS.map(({ value, label }) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</FilterSelect>

				{hasAnyFilter && (
					<button
						type='button'
						onClick={() => onChange({})}
						className='col-span-2 h-11 whitespace-nowrap rounded-input px-sm text-sm text-ink-2 transition-colors duration-(--dur-short) hover:text-ink md:col-span-1'
					>
						Limpar filtros
					</button>
				)}
			</div>
		</div>
	)
}

export default FilterBar
