import SignUpForm from '@/components/auth/SignUpForm'
import { Link } from '@tanstack/react-router'

const SignUpPage = () => {
	return (
		<section className='flex flex-col mx-auto w-full max-w-96 gap-lg px-md py-xl'>
			<header className='flex flex-col gap-xs'>
				<h1 className='text-2xl font-semibold text-ink'>Criar conta</h1>
				<p className='text-sm text-ink-2'>
					Salve suas cartas favoritas e acompanhe os preços de qualquer lugar.
				</p>
			</header>

			<SignUpForm />

			<p className='text-sm text-ink-2'>
				Já tem conta?{' '}
				<Link to='/login' className='text-ink underline'>
					Entrar
				</Link>
			</p>
		</section>
	)
}

export default SignUpPage
