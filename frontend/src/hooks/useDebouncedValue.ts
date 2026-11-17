import { useEffect, useState } from 'react'

// Devolve `value` só depois de ficar `delay` ms sem mudar. Cada mudança
// cancela o timer anterior, então digitar rápido não gera valores intermediários.
export const useDebouncedValue = <T>(value: T, delay: number): T => {
	const [debounced, setDebounced] = useState(value)

	useEffect(() => {
		const timeoutId = setTimeout(() => setDebounced(value), delay)
		return () => clearTimeout(timeoutId)
	}, [value, delay])

	return debounced
}
