import { vi } from 'vitest'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

type AuthCallback = (event: AuthChangeEvent, session: Session | null) => void

// Callback que o código de produção registrou em onAuthStateChange.
let authCallback: AuthCallback | null = null

export const supabaseMock = {
	auth: {
		getSession: vi.fn(),
		onAuthStateChange: vi.fn(),
		signUp: vi.fn(),
		signInWithPassword: vi.fn(),
		signInWithOAuth: vi.fn(),
		signOut: vi.fn(),
		resend: vi.fn(),
		exchangeCodeForSession: vi.fn(),
	},
}

// Formato do módulo '@/lib/supabase', para usar dentro de vi.mock.
export const supabaseModule = { supabase: supabaseMock }

function applyDefaults() {
	const { auth } = supabaseMock
	auth.onAuthStateChange.mockImplementation((callback: AuthCallback) => {
		authCallback = callback
		return { data: { subscription: { unsubscribe: vi.fn() } } }
	})
	auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
	for (const fn of [
		auth.signUp,
		auth.signInWithPassword,
		auth.signInWithOAuth,
		auth.signOut,
		auth.resend,
		auth.exchangeCodeForSession,
	]) {
		fn.mockResolvedValue({ data: {}, error: null })
	}
}

export function resetSupabaseMock() {
	authCallback = null
	for (const fn of Object.values(supabaseMock.auth)) fn.mockReset()
	applyDefaults()
}

export function sessionOf(id: string, email: string): Session {
	return {
		access_token: 'access_token',
		refresh_token: 'refresh_token',
		expires_in: 3600,
		token_type: 'bearer',
		user: {
			id,
			email,
			aud: 'authenticated',
			app_metadata: {},
			user_metadata: {},
			created_at: '2026-01-01T00:00:00Z',
		},
	}
}

export function emitAuthEvent(event: AuthChangeEvent, session: Session | null) {
	if (!authCallback) {
		throw new Error('Nenhum callback registrado: chame initAuth() antes.')
	}
	authCallback(event, session)
}

applyDefaults()
