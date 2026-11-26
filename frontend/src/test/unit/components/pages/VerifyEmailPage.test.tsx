import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import VerifyEmailPage from '@/pages/VerifyEmailPage'
import { resetSupabaseMock, supabaseMock } from '@/test/mocks/supabase'

vi.mock('@/lib/supabase', async () => {
	const { supabaseModule } = await import('@/test/mocks/supabase')
	return supabaseModule
})

// Sem RouterProvider, o Link vira um <a> simples com o mesmo href.
vi.mock('@tanstack/react-router', () => ({
	Link: ({ to, ...props }: ComponentProps<'a'> & { to: string }) => (
		<a href={to} {...props} />
	),
}))

const resendButton = () =>
	screen.getByRole('button', { name: /reenviar e-mail/i })

describe('VerifyEmailPage', () => {
	beforeEach(() => {
		resetSupabaseMock()
		// O relógio falso também controla Date.now() e o setInterval do cooldown.
		vi.useFakeTimers({ shouldAdvanceTime: true })
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should show the address the link was sent to', () => {
		render(<VerifyEmailPage email='ana@example.com' />)

		expect(screen.getByText('ana@example.com')).toBeInTheDocument()
	})

	it('should keep the resend button disabled with a countdown at the start', () => {
		render(<VerifyEmailPage email='ana@example.com' />)

		expect(resendButton()).toBeDisabled()
		expect(resendButton()).toHaveTextContent('60s')
	})

	it('should count down and call resendVerification only after the cooldown', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
		render(<VerifyEmailPage email='ana@example.com' />)

		act(() => {
			vi.advanceTimersByTime(20_000)
		})
		expect(resendButton()).toBeDisabled()
		expect(resendButton()).toHaveTextContent('40s')

		act(() => {
			vi.advanceTimersByTime(40_000)
		})
		expect(resendButton()).toBeEnabled()

		await user.click(resendButton())

		expect(supabaseMock.auth.resend).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'signup', email: 'ana@example.com' }),
		)
		expect(await screen.findByRole('status')).toHaveTextContent(/reenviado/i)
		expect(resendButton()).toBeDisabled()
	})

	it('should show a message and keep the button enabled when the resend fails', async () => {
		supabaseMock.auth.resend.mockResolvedValue({
			data: {},
			error: { code: 'over_email_send_rate_limit', message: 'rate limit' },
		})
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
		render(<VerifyEmailPage email='ana@example.com' />)
		act(() => {
			vi.advanceTimersByTime(60_000)
		})

		await user.click(resendButton())

		expect(await screen.findByRole('status')).toHaveTextContent(
			/não foi possível reenviar/i,
		)
		expect(resendButton()).toBeEnabled()
	})

	it('should hide the resend button when the address is missing', () => {
		render(<VerifyEmailPage />)

		expect(
			screen.queryByRole('button', { name: /reenviar/i }),
		).not.toBeInTheDocument()
		expect(
			screen.getByRole('link', { name: /usar outro e-mail/i }),
		).toHaveAttribute('href', '/signup')
	})
})