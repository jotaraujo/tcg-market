import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initAuth, resetAuth } from '@/lib/auth'
import { useAuthStore } from '@/stores/useAuthStore'
import {
	emitAuthEvent,
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

const rejectWith = (code: string) =>
	supabaseMock.auth.signInWithPassword.mockResolvedValue({
		data: {},
		error: { code, message: 'boom' },
	})

// Como no app de verdade: o Supabase avisa a sessão nova (SIGNED_IN) antes de
// a chamada terminar. Por isso o teste assina o initAuth primeiro.
const signInSucceeds = () =>
	supabaseMock.auth.signInWithPassword.mockImplementation(async () => {
		const session = sessionOf('u1', 'ana@example.com')
		emitAuthEvent('SIGNED_IN', session)
		return { data: { session }, error: null }
	})

const openLogin = async (path = '/login') => {
	await initAuth()
	const user = userEvent.setup()
	const app = renderApp(path)
	await screen.findByRole('heading', { name: 'Entrar' })
	return { user, ...app }
}

const fillAndSubmit = async (
	user: ReturnType<typeof userEvent.setup>,
	email = 'ana@example.com',
	password = 'senha-forte-1',
) => {
	await user.type(screen.getByLabelText('E-mail'), email)
	await user.type(screen.getByLabelText('Senha'), password)
	await user.click(screen.getByRole('button', { name: /^entrar|entrando/i }))
}

describe('LoginForm', () => {
	beforeEach(() => {
		resetSupabaseMock()
		resetAuth()
		useAuthStore.setState(useAuthStore.getInitialState(), true)
	})

	it('should show field errors and not call Supabase with invalid data', async () => {
		const { user } = await openLogin()

		await user.type(screen.getByLabelText('E-mail'), 'abc')
		await user.click(screen.getByRole('button', { name: /^entrar/i }))

		expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
		expect(screen.getByText('Informe a senha.')).toBeInTheDocument()
		expect(supabaseMock.auth.signInWithPassword).not.toHaveBeenCalled()
	})

	it('should send the normalized email and disable the button while signing in', async () => {
		let finish: (value: unknown) => void = () => {}
		supabaseMock.auth.signInWithPassword.mockReturnValue(
			new Promise((resolve) => {
				finish = resolve
			}),
		)
		const { user } = await openLogin()

		await fillAndSubmit(user, '  Ana@Example.com ')

		expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled()
		expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
			email: 'ana@example.com',
			password: 'senha-forte-1',
		})
		finish({ data: {}, error: { code: 'invalid_credentials', message: 'x' } })
		expect(await screen.findByRole('alert')).toBeInTheDocument()
	})

	it('should show a generic message that does not say which field was wrong', async () => {
		rejectWith('invalid_credentials')
		const { user } = await openLogin()

		await fillAndSubmit(user)

		const alert = await screen.findByRole('alert')
		expect(alert).toHaveTextContent('E-mail ou senha incorretos.')
		expect(alert).not.toHaveTextContent(/senha incorreta|e-mail não/i)
	})

	it('should show a specific message with a resend option when the email is not confirmed', async () => {
		rejectWith('email_not_confirmed')
		const { user } = await openLogin()

		await fillAndSubmit(user, 'Ana@Example.com')

		expect(await screen.findByRole('alert')).toHaveTextContent(
			/ainda não foi confirmado/i,
		)

		await user.click(
			screen.getByRole('button', { name: /reenviar e-mail de confirmação/i }),
		)

		expect(supabaseMock.auth.resend).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'signup', email: 'ana@example.com' }),
		)
		expect(await screen.findByRole('status')).toHaveTextContent(/reenviado/i)
	})

	it('should show a generic failure message for unexpected errors', async () => {
		rejectWith('over_request_rate_limit')
		const { user } = await openLogin()

		await fillAndSubmit(user)

		expect(await screen.findByRole('alert')).toHaveTextContent(
			/não foi possível entrar agora/i,
		)
	})

	it('should go to the requested internal path after signing in', async () => {
		signInSucceeds()
		const { user, router } = await openLogin('/login?redirect=%2Ffavorites')

		await fillAndSubmit(user)

		await waitFor(() =>
			expect(router.state.location.pathname).toBe('/favorites'),
		)
	})

	it('should go to /marketplace when there is no redirect', async () => {
		signInSucceeds()
		const { user, router } = await openLogin()

		await fillAndSubmit(user)

		await waitFor(() =>
			expect(router.state.location.pathname).toBe('/marketplace'),
		)
	})

	it.each([
		['//evil.com', '%2F%2Fevil.com'],
		['https://evil.com', 'https%3A%2F%2Fevil.com'],
		['/login', '%2Flogin'],
	])('should fall back to /marketplace when redirect is %s', async (_label, encoded) => {
		signInSucceeds()
		const { user, router } = await openLogin(`/login?redirect=${encoded}`)

		await fillAndSubmit(user)

		await waitFor(() =>
			expect(router.state.location.pathname).toBe('/marketplace'),
		)
	})

	it('should link to the sign up page', async () => {
		await openLogin()

		expect(screen.getByRole('link', { name: /criar conta/i })).toHaveAttribute(
			'href',
			'/signup',
		)
	})
})