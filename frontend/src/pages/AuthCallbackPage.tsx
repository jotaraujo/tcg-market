import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import ResendVerificationForm from '@/components/auth/ResendVerificationForm'
import LoadingState from '@/components/ui/LoadingState'
import { whenAuthReady } from '@/lib/auth'
import { parseAuthCallbackError } from '@/lib/authCallback'
import { safeRedirectPath } from '@/lib/redirect'
import { useAuthStore } from '@/stores/useAuthStore'

interface AuthCallbackPageProps {
	// Destino pedido antes do login (/auth/callback?redirect=...); é validado aqui.
	redirect?: string
}

const AuthCallbackPage = ({ redirect }: AuthCallbackPageProps) => {
	const router = useRouter()
	const { searchStr, hash } = useLocation()
	const callbackError = useMemo(
		() => parseAuthCallbackError({ search: searchStr, hash }),
		[searchStr, hash],
	)
	const hasCode = useMemo(
		() => new URLSearchParams(searchStr).has('code'),
		[searchStr],
	)
	const [sessionMissing, setSessionMissing] = useState(false)

	useEffect(() => {
		if (callbackError) return

		let cancelled = false
		// O supabase-js troca o `code` por sessão sozinho ao iniciar; esperar o
		// initAuth basta. Trocar à mão aqui consumiria o code (uso único) duas
		// vezes no StrictMode.
		whenAuthReady().then(() => {
			if (cancelled) return
			if (useAuthStore.getState().status === 'authenticated') {
				router.history.replace(safeRedirectPath(redirect))
			} else if (hasCode) {
				setSessionMissing(true)
			} else {
				// Aberta direto, sem code nem erro: não há o que fazer aqui.
				router.history.replace('/login')
			}
		})

		return () => {
			cancelled = true
		}
	}, [callbackError, hasCode, redirect, router])

	if (callbackError) {
		const isExpired = callbackError.code === 'otp_expired'
		return (
			<section className='mx-auto flex w-full max-w-96 flex-col gap-lg px-md py-xl'>
				<header className='flex flex-col gap-xs'>
					<h1 className='text-2xl font-semibold text-ink'>
						{isExpired ? 'Link expirado' : 'Não foi possível confirmar'}
					</h1>
					<p className='text-sm text-ink-2'>
						O link de confirmação expirou, já foi usado ou é inválido. Informe
						seu e-mail para receber um novo.
					</p>
				</header>
				<ResendVerificationForm />
			</section>
		)
	}

	if (sessionMissing) {
		return (
			<section className='mx-auto flex w-full max-w-96 flex-col gap-lg px-md py-xl'>
				<header className='flex flex-col gap-xs'>
					<h1 className='text-2xl font-semibold text-ink'>
						Não foi possível entrar automaticamente
					</h1>
					<p className='text-sm text-ink-2'>
						Se você abriu o link em outro navegador ou dispositivo, seu e-mail
						pode já estar confirmado. Tente entrar com a sua senha.
					</p>
				</header>
				{/* @ts-expect-error a rota /login só nasce no T8 */}
				<Link to='/login' className='text-sm text-ink underline'>
					Ir para o login
				</Link>
			</section>
		)
	}

	return <LoadingState message='Confirmando sua conta...' />
}

export default AuthCallbackPage