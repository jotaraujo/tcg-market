import type { Session, User } from '@supabase/supabase-js'
import { useAuthStore } from '@/stores/useAuthStore'
import type { AuthRouterContext, AuthUser } from '@/types/auth'
import { queryClient } from './queryClient'
import { safeRedirectPath } from './redirect'
import { supabase } from './supabase'
import type { LoginInput, SignUpInput } from './validations/authSchema'

export type AuthFailureCode =
	| 'invalid_credentials'
	| 'email_not_confirmed'
	| 'unknown'

// Erro do app: a UI trata `code`, nunca a mensagem crua do Supabase.
export class AuthFailure extends Error {
	readonly code: AuthFailureCode

	constructor(code: AuthFailureCode, message?: string) {
		super(message ?? code)
		this.name = 'AuthFailure'
		this.code = code
	}
}

function toAuthFailure(error: { code?: string; message: string }): AuthFailure {
	if (error.code === 'invalid_credentials') {
		return new AuthFailure('invalid_credentials', error.message)
	}
	if (error.code === 'email_not_confirmed') {
		return new AuthFailure('email_not_confirmed', error.message)
	}
	return new AuthFailure('unknown', error.message)
}

// user_metadata não tem tipo; o nome só vale se for uma string de verdade.
function readName(user: User): string | null {
	const { full_name: fullName, name } = user.user_metadata ?? {}
	if (typeof fullName === 'string' && fullName) return fullName
	if (typeof name === 'string' && name) return name
	return null
}

function toAuthUser(user: User): AuthUser {
	return { id: user.id, email: user.email ?? '', name: readName(user) }
}

function mirrorSession(session: Session | null) {
	const { setAuthenticated, setUnauthenticated } = useAuthStore.getState()
	if (session) setAuthenticated(toAuthUser(session.user))
	else setUnauthenticated()
}

let initPromise: Promise<void> | null = null
let unsubscribe: (() => void) | null = null

export function initAuth(): Promise<void> {
	if (initPromise) return initPromise

	initPromise = (async () => {
		// O callback é síncrono de propósito: chamar outro método do supabase.auth
		// com await aqui dentro causa deadlock.
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_OUT') queryClient.clear()
			mirrorSession(session)
		})
		unsubscribe = () => data.subscription.unsubscribe()

		try {
			const { data: sessionData } = await supabase.auth.getSession()
			mirrorSession(sessionData.session)
		} catch {
			// Sem conseguir ler a sessão, a UI não pode ficar em "loading" para sempre.
			mirrorSession(null)
		}
	})()

	return initPromise
}

export function whenAuthReady(): Promise<void> {
	return initAuth()
}

export function resetAuth() {
	unsubscribe?.()
	unsubscribe = null
	initPromise = null
}

export const authRouterContext: AuthRouterContext = {
	whenReady: whenAuthReady,
	getStatus: () => useAuthStore.getState().status,
}

function callbackUrl(redirectPath?: string): string {
	const url = new URL('/auth/callback', window.location.origin)
	if (redirectPath) {
		url.searchParams.set('redirect', safeRedirectPath(redirectPath))
	}
	return url.toString()
}

export async function signUpWithEmail({
	email,
	password,
}: SignUpInput): Promise<void> {
	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: { emailRedirectTo: callbackUrl() },
	})
	if (error) throw toAuthFailure(error)
}

export async function signInWithEmail({
	email,
	password,
}: LoginInput): Promise<void> {
	const { error } = await supabase.auth.signInWithPassword({ email, password })
	if (error) throw toAuthFailure(error)
}

export async function signInWithGoogle(redirectPath: string): Promise<void> {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: { redirectTo: callbackUrl(redirectPath) },
	})
	if (error) throw toAuthFailure(error)
}

export async function signOut(): Promise<void> {
	const { error } = await supabase.auth.signOut()
	if (error) throw toAuthFailure(error)
}

export async function resendVerification(email: string): Promise<void> {
	const { error } = await supabase.auth.resend({
		type: 'signup',
		email,
		options: { emailRedirectTo: callbackUrl() },
	})
	if (error) throw toAuthFailure(error)
}
