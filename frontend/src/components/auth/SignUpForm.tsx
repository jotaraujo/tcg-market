import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { type SignUpInput, signUpSchema } from '@/lib/validations/authSchema'

interface FieldProps extends ComponentProps<'input'> {
	label: string
	error?: string
}

// Rótulo + campo + mensagem de erro ligados por id, para leitor de tela.
const Field = ({ id, label, error, ...inputProps }: FieldProps) => (
	<div className='flex flex-col gap-xs'>
		<label htmlFor={id} className='text-sm font-medium text-ink'>
			{label}
		</label>
		<Input
			id={id}
			aria-invalid={error ? true : undefined}
			aria-describedby={error ? `${id}-error` : undefined}
			className='h-10'
			{...inputProps}
		/>
		{error && (
			<p id={`${id}-error`} className='text-sm text-destructive'>
				{error}
			</p>
		)}
	</div>
)

const SignUpForm = () => {
	const { signUp } = useAuth()
	const navigate = useNavigate()
	const [submitError, setSubmitError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) })

	const onSubmit = handleSubmit(async (values) => {
		setSubmitError(null)
		try {
			await signUp(values)
		} catch {
			// Mensagem única de propósito: não diz o motivo da falha.
			setSubmitError(
				'Não foi possível criar a conta agora. Tente novamente em instantes.',
			)
			return
		}
		// Vale também para e-mail já cadastrado: o Supabase responde igual, e a
		// tela seguinte não revela se a conta já existia.
		await navigate({ to: '/verify-email', search: { email: values.email } })
	})

	return (
		<form onSubmit={onSubmit} noValidate className='flex flex-col gap-md'>
			<Field
				id='email'
				label='E-mail'
				type='email'
				autoComplete='email'
				error={errors.email?.message}
				{...register('email')}
			/>
			<Field
				id='password'
				label='Senha'
				type='password'
				autoComplete='new-password'
				error={errors.password?.message}
				{...register('password')}
			/>
			<Field
				id='confirmPassword'
				label='Confirmar senha'
				type='password'
				autoComplete='new-password'
				error={errors.confirmPassword?.message}
				{...register('confirmPassword')}
			/>

			{submitError && (
				<p role='alert' className='text-sm text-destructive'>
					{submitError}
				</p>
			)}

			<Button
				type='submit'
				disabled={isSubmitting}
				className='h-10 cursor-pointer'
			>
				{isSubmitting ? 'Criando conta...' : 'Criar conta'}
			</Button>
		</form>
	)
}

export default SignUpForm