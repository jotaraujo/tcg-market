import type { RefObject } from 'react'
import { useCallback, useEffect, useState } from 'react'

interface UseIntersectionObserverProps {
	onIntersect: () => void
	enabled: boolean // permite 'desligar' o sensor quando não há mais páginas
	containerRef?: RefObject<HTMLDivElement | null>  // referência opcional para o container de scroll
}

export const useIntersectionObserver = ({
onIntersect,
enabled,
containerRef,
} : UseIntersectionObserverProps) => {
	const [node, setNode] = useState<HTMLDivElement | null>(null)

	const ref = useCallback((element: HTMLDivElement | null) => {
		setNode(element)
	}, [])

	useEffect(() => {
    // Se não tem mais páginas para carregar, não cria o observer
		if (!enabled || !node) return

		const observer = new IntersectionObserver(
			(entries) => {
        // entries[0] é o único elemento observado
        // isIntersecting = true significa "ele apareceu na tela"
					if (entries[0].isIntersecting) onIntersect()
				},
				{
        // rootMargin faz o trigger acontecer 200px antes do
        // elemento entrar na tela
					rootMargin: '200px',
					// Usar o containerRef.current como root se fornecido, caso contrário usar viewport padrão
					root: containerRef?.current ?? null,
				},
			)

			observer.observe(node)

    // Função de limpeza: remove o observer quando o componente desmonta
    // ou quando o useEffect roda novamente.
    // Assim evitamos memory leak
			return () => {
					observer.unobserve(node)
			}
		}, [enabled, onIntersect, containerRef, node])

		return ref
}