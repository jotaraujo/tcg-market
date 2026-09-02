import { useEffect, useRef } from 'react'

interface UseIntersectionObserverProps {
	onIntersect: () => void
	enabled: boolean // permite 'desligar' o sensor quando não há mais páginas
}

export const useIntersectionObserver = ({
	onIntersect,
	enabled,
} : UseIntersectionObserverProps) => {
  // useRef para guardar a referência do elemento sentinela no DOM
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
    // Se não tem mais páginas para carregar, não cria o observer
		if (!enabled) return

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
			},
		)

		const currentElement = ref.current

		if (currentElement) observer.observe(currentElement)

    // Função de limpeza: remove o observer quando o componente desmonta
    // ou quando o useEffect roda novamente.
    // Assim evitamos memory leak
		return () => {
			if (currentElement) {
				observer.unobserve(currentElement)
			}
		}
	}, [enabled, onIntersect])

	return ref
}
