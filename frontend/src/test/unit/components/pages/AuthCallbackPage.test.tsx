import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

// O destino não importa aqui; evita montar o grid de cartas inteiro.
vi.mock('@/pages/MarketplacePage', () => ({
	default: () => <p>Marketplace</p>,
}))

const EXPIRED_LINK =
	'/auth/callback#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired'

// O supabase-js troca o code por sessão ao iniciar; aqui basta simular o
// resultado: com ou sem sessão depois da checagem inicial.
const withSession = () =>
	supabaseMock.auth.getSession.mockResolvedValue({
		data: { session: sessionOf('u1', 'ana@example.com') },
	})

const pathnameOf = (router: ReturnType<typeof renderApp>['router']) =>
	router.state.location.pathname

describe('AuthCallbackPage', () => {
	beforeEach(() => {
		resetSupabaseMock()
		resetAuth()
		useAuthStore.setState(useAuthStore.getInitialState(), true)
	})

	describe('when the link failed', () => {
		it('should explain that the link expired and let the user ask for another', async () => {
			const user = userEvent.setup()
			renderApp(EXPIRED_LINK)

			expect(
				await screen.findByRole('heading', { name: /link expirado/i }),
			).toBeInTheDocument()

			await user.type(screen.getByLabelText('E-mail'), 'Ana@Example.com')
			await user.click(screen.getByRole('button', { name: /reenviar e-mail/i }))

			expect(supabaseMock.auth.resend).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'signup', email: 'ana@example.com' }),
			)
			expect(await screen.findByRole('status')).toHaveTextContent(/reenviado/i)
		})

		it('should not ask for another link when the email is invalid', async () => {
			const user = userEvent.setup()
			renderApp(EXPIRED_LINK)

			await user.type(await screen.findByLabelText('E-mail'), 'abc')
			await user.click(screen.getByRole('button', { name: /reenviar e-mail/i }))

			expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
			expect(supabaseMock.auth.resend).not.toHaveBeenCalled()
		})

		it('should show a generic title for other errors', async () => {
			renderApp('/auth/callback?error=access_denied&error_code=other_error')

			expect(
				await screen.findByRole('heading', {
					name: /não foi possível confirmar/i,
				}),
			).toBeInTheDocument()
		})
	})

	describe('when the session was established', () => {
		it('should go to the requested internal path', async () => {
			withSession()
			const { router } = renderApp(
				'/auth/callback?redirect=%2Ffavorites&code=abc',
			)

			await waitFor(() => expect(pathnameOf(router)).toBe('/favorites'))
		})

		it('should go to /marketplace when there is no redirect', async () => {
			withSession()
			const { router } = renderApp('/auth/callback?code=abc')

			await waitFor(() => expect(pathnameOf(router)).toBe('/marketplace'))
			expect(await screen.findByText('Marketplace')).toBeInTheDocument()
		})

		it.each([
			['//evil.com', '%2F%2Fevil.com'],
			['https://evil.com', 'https%3A%2F%2Fevil.com'],
			['/login', '%2Flogin'],
		])('should fall back to /marketplace when redirect is %s', async (_label, encoded) => {
			withSession()
			const { router } = renderApp(
				`/auth/callback?redirect=${encoded}&code=abc`,
			)

			await waitFor(() => expect(pathnameOf(router)).toBe('/marketplace'))
		})
	})

	describe('when there is no session', () => {
		it('should go to /login without hanging when opened directly', async () => {
			const { router } = renderApp('/auth/callback')

			await waitFor(() => expect(pathnameOf(router)).toBe('/login'))
		})

		it('should explain the other-browser case when there is a code but no session', async () => {
			const { router } = renderApp('/auth/callback?code=abc')

			expect(
				await screen.findByText(/outro navegador ou dispositivo/i),
			).toBeInTheDocument()
			expect(
				screen.getByRole('link', { name: /ir para o login/i }),
			).toHaveAttribute('href', '/login')
			expect(pathnameOf(router)).toBe('/auth/callback')
		})
	})
})