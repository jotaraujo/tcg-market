import { ArrowUpDown, ChevronDown, type LucideIcon, X } from 'lucide-react'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
} from '@/components/ui/select'
import {
	clearFilters,
	countActiveFilters,
	isSpellOrTrap,
	raceOptionsFor,
	setFilter,
} from '@/lib/filterRules'
import { cn } from '@/lib/utils'
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

interface FilterPillProps {
	// Nome acessível do select ("Tipo", "Ordenar por")
	label: string
	// Texto curto mostrado na pílula; padrão: o próprio label
	text?: string
	value: string
	// Texto do valor escolhido na pílula; padrão: o próprio value
	valueLabel?: string
	onChange: (value: string) => void
	// Remove só este filtro. Sem ele (ordenação) a pílula não ganha o "×".
	onClear?: () => void
	// Texto da opção "sem filtro" dentro da lista ("Todos os tipos", "Padrão")
	emptyLabel: string
	// Ícone mostrado quando não há valor ativo (padrão: seta de seleção)
	icon?: LucideIcon
	className?: string
	// <SelectItem>/<SelectGroup> com as opções reais
	children: React.ReactNode
}

// O Radix Select não aceita value="" num item, então "sem filtro" usa um
// valor reservado que só existe aqui dentro: para fora, continua sendo ''.
const ALL = '__all__'

// A pílula é só a pele: o Select do Radix cuida do teclado, do foco e da
// acessibilidade, e o texto visível é livre (ex.: "Tipo: Effect Monster").
const FilterPill = ({
	label,
	text = label,
	value,
	valueLabel = value,
	onChange,
	onClear,
	emptyLabel,
	icon: Icon = ChevronDown,
	className,
	children,
}: FilterPillProps) => {
	const hasValue = value !== ''
	// Só filtros ficam "acesos"; a ordenação não restringe os resultados.
	const isActive = hasValue && onClear !== undefined

	return (
		<Select
			value={hasValue ? value : ALL}
			onValueChange={(next) => onChange(next === ALL ? '' : next)}
		>
			<div
				className={cn(
					'inline-flex h-11 shrink-0 items-center rounded-pill border text-sm text-ink transition-[background-color,border-color] duration-(--dur-short) hover:bg-paper-3 has-[[role=combobox]:focus-visible]:outline-2 has-[[role=combobox]:focus-visible]:outline-offset-2 has-[[role=combobox]:focus-visible]:outline-focus has-[[role=combobox][data-state=open]]:bg-paper-3 md:h-10',
					isActive
						? 'border-primary bg-primary/15 pr-2xs'
						: 'border-rule bg-paper-2',
					className,
				)}
			>
				<SelectTrigger
					aria-label={label}
					className={cn(
						'flex h-full min-w-0 cursor-pointer items-center gap-xs rounded-pill pl-sm outline-hidden',
						isActive ? 'pr-xs' : 'pr-sm',
					)}
				>
					<span className='max-w-48 truncate'>
						{hasValue ? (
							<>
								<span className='text-ink-2'>{text}:</span>{' '}
								<span className={isActive ? 'font-medium' : undefined}>
									{valueLabel}
								</span>
							</>
						) : (
							text
						)}
					</span>
					{!isActive && (
						<Icon aria-hidden='true' className='size-4 shrink-0 text-ink-2' />
					)}
				</SelectTrigger>

				{isActive && (
					<button
						type='button'
						aria-label={`Remover filtro ${label}`}
						onClick={onClear}
						className='grid size-8 shrink-0 place-items-center rounded-pill text-ink-2 transition-colors duration-(--dur-short) hover:bg-paper-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-focus'
					>
						<X aria-hidden='true' className='size-4' />
					</button>
				)}
			</div>

			<SelectContent aria-label={label}>
				<SelectItem value={ALL}>{emptyLabel}</SelectItem>
				{children}
			</SelectContent>
		</Select>
	)
}

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
	const hasActiveFilter = countActiveFilters(filters) > 0
	// Spell e Trap não têm atributo nem nível: em vez de desabilitar sem
	// explicação, as pílulas somem (a API devolveria "nenhuma carta" de qualquer jeito).
	const hasMonsterFields = !isSpellOrTrap(filters.type)

	const change = (key: keyof SelectableFilters) => (value: string) =>
		onChange(setFilter(filters, key, value))
	const remove = (key: keyof SelectableFilters) => () =>
		onChange(setFilter(filters, key, ''))

	return (
		// Uma linha só. No celular ela rola na horizontal (o padding dá espaço
		// para o anel de foco não ser cortado pelo overflow).
		<div
			role='group'
			aria-label='Filtros e ordenação'
			className='scrollbar-hide -mx-1 -my-1 flex items-center gap-xs overflow-x-auto p-1 md:flex-wrap md:overflow-visible'
		>
			<FilterPill
				label='Tipo'
				value={filters.type ?? ''}
				onChange={change('type')}
				onClear={remove('type')}
				emptyLabel='Todos os tipos'
			>
				<SelectSeparator />
				<SelectGroup>
					<SelectLabel>Main Deck</SelectLabel>
					{CARD_TYPES.mainDeck.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</SelectGroup>
				<SelectSeparator />
				<SelectGroup>
					<SelectLabel>Extra Deck</SelectLabel>
					{CARD_TYPES.extraDeck.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</SelectGroup>
				<SelectSeparator />
				<SelectGroup>
					<SelectLabel>Outros</SelectLabel>
					{CARD_TYPES.otherTypes.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</SelectGroup>
			</FilterPill>

			{hasMonsterFields && (
				<FilterPill
					label='Atributo'
					value={filters.attribute ?? ''}
					onChange={change('attribute')}
					onClear={remove('attribute')}
					emptyLabel='Todos os atributos'
				>
					{ATTRIBUTE_OPTIONS.map((attribute) => (
						<SelectItem key={attribute} value={attribute}>
							{attribute}
						</SelectItem>
					))}
				</FilterPill>
			)}

			<FilterPill
				label='Raça'
				value={filters.race ?? ''}
				onChange={change('race')}
				onClear={remove('race')}
				emptyLabel='Todas as raças'
			>
				{raceOptionsFor(filters.type).map((race) => (
					<SelectItem key={race} value={race}>
						{race}
					</SelectItem>
				))}
			</FilterPill>

			{hasMonsterFields && (
				<FilterPill
					label='Nível'
					value={filters.level === undefined ? '' : String(filters.level)}
					onChange={change('level')}
					onClear={remove('level')}
					emptyLabel='Todos os níveis'
				>
					{LEVEL_OPTIONS.map((level) => (
						<SelectItem key={level} value={String(level)}>
							{level}
						</SelectItem>
					))}
				</FilterPill>
			)}

			{/* Fica logo depois das pílulas: ao aparecer, nada muda de lugar */}
			{hasActiveFilter && (
				<button
					type='button'
					onClick={() => onChange(clearFilters(filters))}
					className='inline-flex h-11 shrink-0 items-center gap-2xs whitespace-nowrap rounded-pill px-sm text-sm text-ink-2 transition-colors duration-(--dur-short) hover:bg-paper-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-focus md:h-10'
				>
					<X aria-hidden='true' className='size-4' />
					Limpar filtros
				</button>
			)}

			{/* Ordenar é outro conceito: fica separado, à direita, sem destaque */}
			<FilterPill
				label='Ordenar por'
				text='Ordenar'
				value={filters.sort ?? ''}
				valueLabel={
					SORT_OPTIONS.find(({ value }) => value === filters.sort)?.label
				}
				onChange={change('sort')}
				emptyLabel='Padrão'
				icon={ArrowUpDown}
				className='md:ml-auto'
			>
				{SORT_OPTIONS.map(({ value, label }) => (
					<SelectItem key={value} value={value}>
						{label}
					</SelectItem>
				))}
			</FilterPill>
		</div>
	)
}

export default FilterBar
