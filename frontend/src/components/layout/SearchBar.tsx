import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { type KeyboardEvent, type Ref, useEffect, useId, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
	MIN_SUGGESTION_CHARS,
	useCardSuggestions,
} from '@/hooks/useCardSuggestions'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useSearchTerm } from '@/hooks/useSearchTerm'
import type { Card } from '@/types/card'

interface SearchBarProps {
	// Permite ao Header focar o input direto no clique da lupa (mobile).
	ref?: Ref<HTMLInputElement>
	className?: string
}

const DEBOUNCE_MS = 300

// Destaca em negrito o trecho do nome que casa com o que foi digitado.
const HighlightedName = ({ name, term }: { name: string; term: string }) => {
	const needle = term.trim().toLowerCase()
	const start = needle ? name.toLowerCase().indexOf(needle) : -1
	if (start === -1) return <>{name}</>

	const end = start + needle.length
	return (
		<>
			{name.slice(0, start)}
			<strong className='font-semibold'>{name.slice(start, end)}</strong>
			{name.slice(end)}
		</>
	)
}

const SearchBar = ({ ref, className }: SearchBarProps) => {
	const { term, setTerm } = useSearchTerm()
	const navigate = useNavigate()
	const listboxId = useId()

	const [inputValue, setInputValue] = useState(term)
	const [isOpen, setIsOpen] = useState(false)
	const [activeIndex, setActiveIndex] = useState(-1)

	// Um único valor "assentado" alimenta o filtro do grid e as sugestões:
	// digitar rápido não dispara nenhuma das duas a cada tecla.
	const debouncedValue = useDebouncedValue(inputValue, DEBOUNCE_MS)

	useEffect(() => {
		setTerm(debouncedValue)
	}, [debouncedValue, setTerm])

	const { data: suggestions = [] } = useCardSuggestions(debouncedValue)

	// As sugestões vêm do termo "assentado": se o campo já voltou a ter menos de
	// 2 caracteres, esconde a lista antiga em vez de mostrar resultado velho.
	const canSuggest = inputValue.trim().length >= MIN_SUGGESTION_CHARS
	const isListVisible = isOpen && canSuggest && suggestions.length > 0
	const highlighted =
		isListVisible && activeIndex < suggestions.length ? activeIndex : -1

	const optionId = (index: number) => `${listboxId}-${index}`

	const closeList = () => {
		setIsOpen(false)
		setActiveIndex(-1)
	}

	const selectCard = (card: Card) => {
		closeList()
		navigate({ to: '/card/$id', params: { id: String(card.id) } })
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		const count = suggestions.length

		switch (event.key) {
			case 'ArrowDown':
				if (!canSuggest || count === 0) return
				event.preventDefault()
				setIsOpen(true)
				setActiveIndex(isListVisible ? (highlighted + 1) % count : 0)
				break
			case 'ArrowUp':
				if (!isListVisible) return
				event.preventDefault()
				setActiveIndex(highlighted <= 0 ? count - 1 : highlighted - 1)
				break
			case 'Enter':
				if (highlighted >= 0) {
					event.preventDefault()
					selectCard(suggestions[highlighted])
				} else {
					// Sem sugestão marcada: aplica a busca na hora, sem esperar o debounce
					setTerm(inputValue)
					closeList()
				}
				break
			case 'Escape':
				if (isListVisible) {
					// Só fecha a lista; o Header (mobile) não deve fechar a busca junto
					event.preventDefault()
					event.stopPropagation()
					closeList()
				}
				break
		}
	}

	return (
		<div className='relative flex max-w-256 flex-1'>
			<label
				className={cn(
					'flex flex-1 items-center gap-2 rounded-full bg-transparent px-4 py-2 text-muted-foreground cursor-pointer',
					className,
				)}
			>
				<Search className='h-4 w-4 shrink-0' aria-hidden='true' />
				<Input
					ref={ref}
					type='search'
					role='combobox'
					aria-label='Buscar cartas'
					aria-autocomplete='list'
					aria-expanded={isListVisible}
					aria-controls={isListVisible ? listboxId : undefined}
					aria-activedescendant={
						highlighted >= 0 ? optionId(highlighted) : undefined
					}
					autoComplete='off'
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value)
						setIsOpen(true)
						setActiveIndex(-1)
					}}
					onFocus={() => setIsOpen(true)}
					onBlur={closeList}
					onKeyDown={handleKeyDown}
					placeholder='Buscar cartas...'
					className='w-full rounded-full bg-input text-sm text-text placeholder:text-text-muted outline-none focus-visible:ring-1 ring-accent transition-all duration-200 [&::-webkit-search-cancel-button]:appearance-none'
				/>
			</label>

			{isListVisible && (
				<>
					{/* Avisa o leitor de tela que a lista abriu (o foco continua no campo) */}
					<span role='status' className='sr-only'>
						{suggestions.length} sugestões disponíveis
					</span>
					<ul
						id={listboxId}
						role='listbox'
						aria-label='Sugestões de cartas'
						className='absolute top-full left-0 z-50 mt-xs w-full min-w-64 rounded-card border border-rule bg-popover p-xs text-popover-foreground shadow-menu lg:min-w-80'
					>
						{suggestions.map((card, index) => (
							// O foco fica no input (aria-activedescendant), então o mouse
							// não pode roubá-lo: o mousedown é cancelado e o clique seleciona.
							<li
								key={card.id}
								id={optionId(index)}
								role='option'
								aria-selected={index === highlighted}
								onMouseDown={(event) => event.preventDefault()}
								onMouseEnter={() => setActiveIndex(index)}
								onClick={() => selectCard(card)}
								className={cn(
									'flex cursor-pointer flex-col rounded-input px-sm py-xs',
									index === highlighted && 'bg-paper-3',
								)}
							>
								<span className='truncate text-sm text-ink'>
									<HighlightedName name={card.name} term={inputValue} />
								</span>
								<span
									aria-hidden='true'
									className='truncate text-sm text-ink-2'
								>
									{card.type}
								</span>
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	)
}

export default SearchBar
