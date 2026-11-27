import type { AnyRouter } from '@tanstack/react-router'
import { useAuthStore } from '#/stores/useAuthStore'

export function watchSessionLoss(router: AnyRouter): () => void {
	return useAuthStore.subscribe((state, previous) => {
		if (
			previous.status === 'authenticated' &&
			state.status === 'unauthenticated'
		) {
			void router.invalidate()
		}
	})
}
