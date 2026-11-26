import { Link } from '@tanstack/react-router'
import LoginForm from '#/components/auth/LoginForm'

interface LoginPageProps {
	redirect?: string
}

const LoginPage = ({ redirect }: LoginPageProps) => {
	return (
		<section className='flex flex-col mx-auto w-full max-w-96 gap-lg px-md py-xl'>
			<header className='flex flex-col gap-xs'>
				<h1 className='text-2xl font-semibold text-ink'>Entrar</h1>
				<p className='text-sm text-ink-2'>
					Acesse sua conta para ver e salvar suas cartas favoritas.
				</p>
			</header>

			<LoginForm redirect={redirect} />

      <p className='text-sm text-ink-2'>
        Não tem conta?{' '}
        <Link to='/signup' className='text-ink underline'>
        Criar Conta</Link>
      </p>
		</section>
	)
}

export default LoginPage
