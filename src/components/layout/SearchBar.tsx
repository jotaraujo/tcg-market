import { useEffect, useState } from 'react'
import { useSearchTerm } from '@/hooks/useSearchTerm'
import { Input } from '../../../@/components/ui/input'
import { Search } from 'lucide-react'

const SearchBar = () => {
	const { term, setTerm } = useSearchTerm()

	const [inputValue, setInputValue] = useState(term)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setTerm(inputValue)
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [inputValue, setTerm])

	return (
		<div className='flex flex-1 max-w-8xl items-center gap-2 rounded-full bg-transparent px-4 py-2 text-muted-foreground cursor-pointer'>
			<Search className='h-4 w-4 shrink-0' />
			<Input
				type='text'
				value={inputValue}
				onChange={({ target }) => setInputValue(target.value)}
        placeholder='Buscar cartas...'
        className='w-full rounded-full bg-input text-sm text-text placeholder:text-text-muted outline-none focus-visible:ring-1 ring-accent cursor-pointer transition-all duration-200'
			/>
		</div>
	)
}

export default SearchBar
