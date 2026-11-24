import { create } from 'zustand'
import type { AuthStatus, AuthUser } from '@/types/auth'

interface AuthState {
	status: AuthStatus
	user: AuthUser | null
	setAuthenticated: (user: AuthUser) => void
	setUnauthenticated: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
	status: 'loading',
	user: null,
	setAuthenticated: (user) => set({ status: 'authenticated', user }),
	setUnauthenticated: () => set({ status: 'unauthenticated', user: null })
}))
