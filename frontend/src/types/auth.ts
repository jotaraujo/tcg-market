export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthUser {
	id: string
	email: string
	name: string | null
}

export interface AuthRouterContext {
	whenReady: () => Promise<void>
	getStatus: () => AuthStatus
}
