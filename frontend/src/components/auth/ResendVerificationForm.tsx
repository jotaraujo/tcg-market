import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema } from '@/lib/validations/authSchema'

// Quando o link expira a URL não traz o e-mail, então a pessoa o informa de novo
const ResendVerificationForm = () => {
	const { resendVerification } = useAuth()
	const [email, setEmail] = useState('')
	const [isSending, setIsSending] = useState(false)
	const [message, setMessage] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		setMessage(null)
		setError(null)

		// Reaproveita a normalização e a mensagem do schema de login
		const parsed = loginSchema.shape.email.safeParse(email)
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? 'E-mail inválido')
			return
		}

		setIsSending(true)
		try {
			await resendVerification(parsed.data)
			setMessage('E-mail reenviado. Confira também a caixa de spam.')
		} catch {
			setError('Não foi possível reenviar agora. Tente novamente em instantes.')
		} finally {
			setIsSending(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} noValidate className='flex flex-col gap-sm'>
			<label htmlFor='resend-email' className='text-sm font-medium text-ink'>
				E-mail
			</label>
			<Input
				id='resend-email'
				type='email'
				autoComplete='email'
				value={email}
				onChange={(event) => setEmail(event.target.value)}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? 'resend-email-error' : undefined}
				className='h-10'
			/>
			{error && (
				<p id='resend-email-error' className='text-sm text-destructive'>
					{error}
				</p>
			)}
			{message && (
				<p role='status' className='text-sm text-ink-2'>
					{message}
				</p>
			)}
			<Button
				type='submit'
				disabled={isSending}
				className='h-10 cursor-pointer'
			>
				{isSending ? 'Reenviando...' : 'Reenviar e-mail'}
			</Button>
		</form>
	)
}

export default ResendVerificationForm
