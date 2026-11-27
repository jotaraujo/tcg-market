import { redirect } from '@tanstack/react-router'
import type { AuthRouterContext } from '@/types/auth'

// Contexto que o roteador carrega para todas as rotas (ver router.tsx).
export interface RouterContext {
	auth: AuthRouterContext
}

// Guarda de rota: espera a checagem inicial da sessão e, sem sessão, manda
// para /login lembrando o destino. É só UX; a proteção real está na API.
export async function requireAuth({
	context,
	location,
}: {
	context: RouterContext
	location: { href: string }
}): Promise<void> {
	await context.auth.whenReady()

	if (context.auth.getStatus() !== 'authenticated') {
		throw redirect({ to: '/login', search: { redirect: location.href } })
	}
}
