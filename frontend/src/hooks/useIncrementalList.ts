import { useState } from 'react'

// Mostra uma lista longa aos poucos (lotes), para renderizar só o que a pessoa
// já alcançou rolando. A lista inteira já está na memória: o que cresce é só
// quanto dela vira elemento no DOM. Para voltar ao primeiro lote quando a
// lista muda, quem usa remonta o componente com `key`.
export const useIncrementalList = <T>(items: T[], batchSize = 24) => {
	const [count, setCount] = useState(batchSize)

	return {
		visible: items.slice(0, count),
		hasMore: count < items.length,
		loadMore: () => setCount((current) => current + batchSize),
	}
}
