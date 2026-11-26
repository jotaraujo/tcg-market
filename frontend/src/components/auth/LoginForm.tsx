import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { AuthFailure } from '@/lib/auth'
import { safeRedirectPath } from '@/lib/redirect'
import { type LoginInput, loginSchema } from '@/lib/validations/authSchema'
import FormField from './FormField'

interface LoginFormProps {
	// Destino pedido antes do login (/login?redirect=...); é validado ao usar.
	redirect?: string
}

type LoginProblem =
	| { kind: 'invalid' }
	| { kind: 'unconfirmed'; email: string }
	| { kind: 'unknown' }

const PROBLEM_MESSAGES: Record<LoginProblem['kind'], string> = {
	invalid: 'E-mail ou senha incorretos.',
	unconfirmed:
		'Seu e-mail ainda não foi confirmado. Use o link que enviamos ou peça um novo.',
	unknown: 'Não foi possível entrar agora. Tente novamente em instantes.',
}

const LoginForm = ({ redirect }: LoginFormProps) => {
	const { signIn, resendVerification } = useAuth()
	const router = useRouter()
	const [problem, setProblem] = useState<LoginProblem | null>(null)
	const [resendMessage, setResendMessage] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

	const onSubmit = handleSubmit(async (values) => {
		setProblem(null)
		setResendMessage(null)
		try {
			await signIn(values)
		} catch (error) {
			if (
				error instanceof AuthFailure &&
				error.code === 'invalid_credentials'
			) {
				setProblem({ kind: 'invalid' })
			} else if (
				error instanceof AuthFailure &&
				error.code === 'email_not_confirmed'
			) {
				setProblem({ kind: 'unconfirmed', email: values.email })
			} else {
				setProblem({ kind: 'unknown' })
			}
			return
		}
		router.history.replace(safeRedirectPath(redirect))
	})

	const handleResend = async (email: string) => {
		setResendMessage(null)
		try {
			await resendVerification(email)
			setResendMessage('E-mail reenviado. Confira também a caixa de spam.')
		} catch {
			setResendMessage(
				'Não foi possível reenviar agora. Tente novamente em instantes.',
			)
		}
	}

	return (
		<form onSubmit={onSubmit} noValidate className='flex flex-col gap-md'>
			<FormField
				id='email'
				label='E-mail'
				type='email'
				autoComplete='email'
				error={errors.email?.message}
				{...register('email')}
			/>
			<FormField
				id='password'
				label='Senha'
				type='password'
				autoComplete='current-password'
				error={errors.password?.message}
				{...register('password')}
			/>

			{problem && (
				<div className='flex flex-col gap-xs'>
					<p role='alert' className='text-sm text-destructive'>
						{PROBLEM_MESSAGES[problem.kind]}
					</p>
					{problem.kind === 'unconfirmed' && (
						<Button
							type='button'
							variant='outline'
							onClick={() => handleResend(problem.email)}
							className='h-10 cursor-pointer'
						>
							Reenviar e-mail de confirmação
						</Button>
					)}
					{resendMessage && (
						<p role='status' className='text-sm text-ink-2'>
							{resendMessage}
						</p>
					)}
				</div>
			)}

			<Button
				type='submit'
				disabled={isSubmitting}
				className='h-10 cursor-pointer'
			>
				{isSubmitting ? 'Entrando...' : 'Entrar'}
			</Button>
		</form>
	)
}

export default LoginForm
