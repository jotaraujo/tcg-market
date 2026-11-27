import type { AnyRouter } from '@tanstack/react-router'
import { screen, waitFor } from '@testing-library/react'
import { initAuth, resetAuth } from '@/lib/auth'
import { watchSessionLoss } from '@/lib/watchSessionLoss'
import { useAuthStore } from '@/stores/useAuthStore'
import {
	emitAuthEvent,
	resetSupabaseMock,
	sessionOf,
	supabaseMock,
} from '@/test/mocks/supabase'
import { renderApp } from '@/test/renderApp'
import type { AuthUser } from '@/types/auth'

vi.mock('@/lib/supabase', async () => {
	const { supabaseModule } = await import('@/test/mocks/supabase')
	return supabaseModule
})

vi.mock('@/pages/FavoritesPage', () => ({
	default: () => <h1>Favoritos</h1>,
}))
vi.mock('@/pages/MarketplacePage', () => ({
	default: () => <h1>Marketplace</h1>,
}))

const ana: AuthUser = { id: 'u1', email: 'ana@example.com', name: null }

const withSession = () =>
	supabaseMock.auth.getSession.mockResolvedValue({
		data: { session: sessionOf('u1', 'ana@example.com') },
	})

beforeEach(() => {
	resetSupabaseMock()
	resetAuth()
	useAuthStore.setState(useAuthStore.getInitialState(), true)
})

describe('watchSessionLoss', () => {
	describe('with the app running', () => {
		it('should send the user to the login page when the session is lost on a protected route', async () => {
			withSession()
			const { router } = renderApp('/favorites')
			await screen.findByRole('heading', { name: 'Favoritos' })
			const stop = watchSessionLoss(router)

			emitAuthEvent('SIGNED_OUT', null)

			await waitFor(() =>
				expect(router.state.location.pathname).toBe('/login'),
			)
			expect(router.state.location.search).toEqual({ redirect: '/favorites' })
			stop()
		})

		it('should keep the user on a public route when the session is lost', async () => {
			withSession()
			// Rota pública não dispara a checagem; no app real, o main.tsx faz isso.
			await initAuth()
			const { router } = renderApp('/marketplace')
			await screen.findByRole('heading', { name: 'Marketplace' })
			const stop = watchSessionLoss(router)

			emitAuthEvent('SIGNED_OUT', null)

			await waitFor(() =>
				expect(useAuthStore.getState().status).toBe('unauthenticated'),
			)
			expect(router.state.location.pathname).toBe('/marketplace')
			expect(
				screen.getByRole('heading', { name: 'Marketplace' }),
			).toBeInTheDocument()
			stop()
		})
	})

	describe('transitions', () => {
		const makeRouter = () => {
			const invalidate = vi.fn().mockResolvedValue(undefined)
			return { router: { invalidate } as unknown as AnyRouter, invalidate }
		}

		it('should invalidate the router on authenticated to unauthenticated', () => {
			const { router, invalidate } = makeRouter()
			useAuthStore.getState().setAuthenticated(ana)
			const stop = watchSessionLoss(router)

			useAuthStore.getState().setUnauthenticated()

			expect(invalidate).toHaveBeenCalledTimes(1)
			stop()
		})

		it('should not invalidate when the first check finds no session', () => {
			const { router, invalidate } = makeRouter()
			const stop = watchSessionLoss(router)

			useAuthStore.getState().setUnauthenticated()

			expect(invalidate).not.toHaveBeenCalled()
			stop()
		})

		it('should not invalidate when the user signs in', () => {
			const { router, invalidate } = makeRouter()
			const stop = watchSessionLoss(router)

			useAuthStore.getState().setAuthenticated(ana)

			expect(invalidate).not.toHaveBeenCalled()
			stop()
		})

		it('should stop reacting after unsubscribing', () => {
			const { router, invalidate } = makeRouter()
			useAuthStore.getState().setAuthenticated(ana)
			const stop = watchSessionLoss(router)

			stop()
			useAuthStore.getState().setUnauthenticated()

			expect(invalidate).not.toHaveBeenCalled()
		})
	})
})