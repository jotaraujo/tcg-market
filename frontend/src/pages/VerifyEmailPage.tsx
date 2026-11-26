import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { getResendRemainingSeconds } from '@/lib/resendCooldown'

interface VerifyEmailPageProps {
	// Vem da URL (/verify-email?email=...); pode faltar se a pessoa abriu direto.
	email?: string
}

const VerifyEmailPage = ({ email }: VerifyEmailPageProps) => {
	const { resendVerification } = useAuth()
	// O cadastro acabou de enviar um e-mail, então o cooldown já começa ativo.
	const [lastSentAt, setLastSendAt] = useState(() => Date.now())
	const [now, setNow] = useState(lastSentAt)
	const [feedback, setFeedback] = useState<string | null>(null)
	const [isResending, setIsResending] = useState(false)

	const remaining = getResendRemainingSeconds(lastSentAt, now)
	const isCoolingDown = remaining > 0

	// O relógio só corre enquanto há contagem; parado, não renderiza à toa.
	useEffect(() => {
		if (!isCoolingDown) return
		const id = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(id)
	}, [isCoolingDown])

	const handleResend = async () => {
		if (!email) return
		setIsResending(true)
		setFeedback(null)

		try {
			await resendVerification(email)
			const sentAt = Date.now()
			setLastSendAt(sentAt)
			setNow(sentAt)
			setFeedback('E-mail reenviado. Confira também a caixa de spam.')
		} catch {
			setFeedback(
				'Não foi possível reenviar agora. Tente novamente em instantes.',
			)
		} finally {
			setIsResending(false)
		}
	}

	return (
		<section className='flex flex-col mx-auto w-full max-w-96 gap-lg px-md py-xl'>
			<header className='flex flex-col gap-xs'>
				<h1 className='text-2xl font-semibold text-ink'>
					Verifique seu e-mail
				</h1>
				<p className='text-sm text-ink-2'>
					{email ? (
						<>
							Enviamos um link de confirmação para{' '}
							<strong className='font-medium text-ink'>{email}</strong>. Abra o
							e-mail e clique no link para ativar a conta.
						</>
					) : (
						'Enviamos um link de confirmação para o seu e-mail. Abra o e-mail e clique no link para ativar a conta.'
					)}
				</p>
			</header>

			{email ? (
				<div className='flex flex-col gap-xs'>
					<Button
						type='button'
						variant='outline'
						disabled={isCoolingDown || isResending}
						onClick={handleResend}
						className='h-10 cursor-pointer'
					>
						{isCoolingDown
							? `Reenviar e-mail em ${remaining}s`
							: 'Reenviar e-mail'}
					</Button>
					{feedback && (
						<p role='status' className='text-sm text-ink-2'>
							{feedback}
						</p>
					)}
				</div>
			) : null}

			<Link to='/signup' className='text-sm text-ink-2 underline'>
				Usar outro e-mail
			</Link>
		</section>
	)
}

export default VerifyEmailPage
