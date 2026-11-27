import { screen, waitFor } from '@testing-library/react'
import { resetAuth } from '@/lib/auth'
import { useAuthStore } from '@/stores/useAuthStore'
import {
	resetSupabaseMock,
	sessionOf,
	supabaseMock,
} from '@/test/mocks/supabase'
import { renderApp } from '@/test/renderApp'

vi.mock('@/lib/supabase', async () => {
	const { supabaseModule } = await import('@/test/mocks/supabase')
	return supabaseModule
})

// As páginas reais não importam aqui; títulos simples bastam para saber
// qual rota foi renderizada.
vi.mock('@/pages/FavoritesPage', () => ({
	default: () => <h1>Favoritos</h1>,
}))
vi.mock('@/pages/ProfilePage', () => ({
	default: () => <h1>Perfil</h1>,
}))

const withSession = () =>
	supabaseMock.auth.getSession.mockResolvedValue({
		data: { session: sessionOf('u1', 'ana@example.com') },
	})

describe('requireAuth', () => {
	beforeEach(() => {
		resetSupabaseMock()
		resetAuth()
		useAuthStore.setState(useAuthStore.getInitialState(), true)
	})

	it.each([
		['/favorites', 'Favoritos'],
		['/profile', 'Perfil'],
	])('should send a visitor without session from %s to the login page', async (path, title) => {
		const { router } = renderApp(path)

		await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
		expect(router.state.location.search).toEqual({ redirect: path })
		expect(
			screen.queryByRole('heading', { name: title }),
		).not.toBeInTheDocument()
	})

	it('should keep the query string in the redirect destination', async () => {
		const { router } = renderApp('/favorites?ordem=nome')

		await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
		expect(router.state.location.search).toEqual({
			redirect: '/favorites?ordem=nome',
		})
	})

	it('should render the protected page when there is a session', async () => {
		withSession()
		const { router } = renderApp('/favorites')

		expect(
			await screen.findByRole('heading', { name: 'Favoritos' }),
		).toBeInTheDocument()
		expect(router.state.location.pathname).toBe('/favorites')
	})

	it('should not show protected content nor redirect while the initial check is pending', async () => {
		let resolveSession: (value: unknown) => void = () => {}
		supabaseMock.auth.getSession.mockReturnValue(
			new Promise((resolve) => {
				resolveSession = resolve
			}),
		)
		const { router } = renderApp('/favorites')

		// Dá tempo de o guarda rodar: sem resposta, nada deve acontecer.
		await new Promise((resolve) => setTimeout(resolve, 50))
		expect(
			screen.queryByRole('heading', { name: 'Favoritos' }),
		).not.toBeInTheDocument()
		expect(router.state.location.pathname).not.toBe('/login')

		resolveSession({
			data: { session: sessionOf('u1', 'ana@example.com') },
			error: null,
		})

		expect(
			await screen.findByRole('heading', { name: 'Favoritos' }),
		).toBeInTheDocument()
	})
})
