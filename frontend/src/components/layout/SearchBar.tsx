import { useEffect, useState, type Ref } from 'react'
import { useSearchTerm } from '@/hooks/useSearchTerm'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { cn } from 'cn'

interface SearchBarProps {
	// Permite ao Header focar o input direto no clique da lupa (mobile).
	ref?: Ref<HTMLInputElement>
	className?: string
}

const SearchBar = ({ ref, className }: SearchBarProps) => {
	const { term, setTerm } = useSearchTerm()

	const [inputValue, setInputValue] = useState(term)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setTerm(inputValue)
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [inputValue, setTerm])

	return (
		<label className={cn('flex flex-1 max-w-256 items-center gap-2 rounded-full bg-transparent px-4 py-2 text-muted-foreground cursor-pointer', className)}>
			<Search className='h-4 w-4 shrink-0' aria-hidden='true' />
			<Input
				ref={ref}
				type='search'
				aria-label='Buscar cartas'
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				placeholder='Buscar cartas...'
				className='w-full rounded-full bg-input text-sm text-text placeholder:text-text-muted outline-none focus-visible:ring-1 ring-accent transition-all duration-200 [&::-webkit-search-cancel-button]:appearance-none'
			/>
		</label>
	)
}

export default SearchBar
