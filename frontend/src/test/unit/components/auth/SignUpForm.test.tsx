import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { resetSupabaseMock, supabaseMock } from '@/test/mocks/supabase'
import { renderApp } from '@/test/renderApp'

vi.mock('@/lib/supabase', async () => {
	const { supabaseModule } = await import('@/test/mocks/supabase')
	return supabaseModule
})

// Abre /signup com as rotas reais e preenche o formulário.
const fillSignUp = async (values: {
	email: string
	password: string
	confirmPassword?: string
}) => {
	const user = userEvent.setup()
	renderApp('/signup')

	await user.type(await screen.findByLabelText('E-mail'), values.email)
	await user.type(screen.getByLabelText('Senha'), values.password)
	await user.type(
		screen.getByLabelText('Confirmar senha'),
		values.confirmPassword ?? values.password,
	)
	return user
}

const submitButton = () =>
	screen.getByRole('button', { name: /criar conta|criando conta/i })

describe('SignUpForm', () => {
	beforeEach(() => {
		resetSupabaseMock()
	})

	it('should show a field error and not call signUp when the password is too short', async () => {
		const user = await fillSignUp({ email: 'ana@example.com', password: '123' })

		await user.click(submitButton())

		expect(
			await screen.findByText('A senha deve ter pelo menos 8 caracteres.'),
		).toBeInTheDocument()
		expect(supabaseMock.auth.signUp).not.toHaveBeenCalled()
	})

	it('should show an error under the confirmation field when the passwords differ', async () => {
		const user = await fillSignUp({
			email: 'ana@example.com',
			password: 'senha-forte-1',
			confirmPassword: 'senha-forte-2',
		})

		await user.click(submitButton())

		expect(
			await screen.findByText('As senhas não coincidem.'),
		).toBeInTheDocument()
		expect(supabaseMock.auth.signUp).not.toHaveBeenCalled()
	})

	it('should disable the button while sending and go to /verify-email with the normalized address', async () => {
		let finishSignUp: (value: unknown) => void = () => {}
		supabaseMock.auth.signUp.mockReturnValue(
			new Promise((resolve) => {
				finishSignUp = resolve
			}),
		)
		const user = await fillSignUp({
			email: '  Ana@Example.com ',
			password: 'senha-forte-1',
		})

		await user.click(submitButton())

		expect(submitButton()).toBeDisabled()
		expect(supabaseMock.auth.signUp).toHaveBeenCalledWith(
			expect.objectContaining({
				email: 'ana@example.com',
				password: 'senha-forte-1',
			}),
		)

		finishSignUp({ data: {}, error: null })

		expect(await screen.findByText(/verifique seu e-mail/i)).toBeInTheDocument()
		expect(screen.getByText('ana@example.com')).toBeInTheDocument()
	})

	it('should go to the same screen when the email already exists, revealing nothing', async () => {
		// Com confirmação de e-mail ligada, o Supabase responde sem erro e com
		// `identities` vazio para um e-mail já cadastrado.
		supabaseMock.auth.signUp.mockResolvedValue({
			data: { user: { identities: [] }, session: null },
			error: null,
		})
		const user = await fillSignUp({
			email: 'ana@example.com',
			password: 'senha-forte-1',
		})

		await user.click(submitButton())

		expect(await screen.findByText(/verifique seu e-mail/i)).toBeInTheDocument()
		expect(
			screen.queryByText(/já existe|já cadastrado/i),
		).not.toBeInTheDocument()
	})

	it('should show a generic error and stay on the form when sign up fails', async () => {
		supabaseMock.auth.signUp.mockResolvedValue({
			data: {},
			error: { code: 'over_email_send_rate_limit', message: 'rate limit' },
		})
		const user = await fillSignUp({
			email: 'ana@example.com',
			password: 'senha-forte-1',
		})

		await user.click(submitButton())

		expect(await screen.findByRole('alert')).toHaveTextContent(
			/não foi possível criar a conta/i,
		)
		expect(screen.queryByText(/verifique seu e-mail/i)).not.toBeInTheDocument()
		expect(submitButton()).toBeEnabled()
	})
})