import {
	resendVerification,
	signInWithEmail,
	signInWithGoogle,
	signOut,
	signUpWithEmail,
} from '@/lib/auth'
import { useAuthStore } from '@/stores/useAuthStore'

export function useAuth() {
	// Um seletor por campo: devolver um objeto novo a cada render faria o
	// Zustand 5 entrar em loop.
	const status = useAuthStore((state) => state.status)
	const user = useAuthStore((state) => state.user)

	return {
		status,
		user,
		isAuthenticated: status === 'authenticated',
		signUp: signUpWithEmail,
		signIn: signInWithEmail,
		signInWithGoogle,
		signOut,
		resendVerification,
	}
}
