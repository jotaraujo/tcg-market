import { initAuth, resetAuth, signInWithEmail, whenAuthReady } from '@/lib/auth'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/stores/useAuthStore'
import {
	emitAuthEvent,
	resetSupabaseMock,
	sessionOf,
	supabaseMock,
} from '@/test/mocks/supabase'

vi.mock('@/lib/supabase', async () => {
	const { supabaseModule } = await import('@/test/mocks/supabase')
	return supabaseModule
})

beforeEach(() => {
	resetSupabaseMock()
	resetAuth()
	queryClient.clear()
	useAuthStore.setState(useAuthStore.getInitialState(), true)
})

describe('initAuth', () => {
	it('should mirror the session into the store when there is one at startup', async () => {
		supabaseMock.auth.getSession.mockResolvedValue({
			data: { session: sessionOf('u1', 'a@b.co') },
		})

		await initAuth()

		expect(useAuthStore.getState()).toMatchObject({
			status: 'authenticated',
			user: { id: 'u1', email: 'a@b.co', name: null },
		})
	})

	it('should become unauthenticated when there is no session at startup', async () => {
		await initAuth()

		expect(useAuthStore.getState()).toMatchObject({
			status: 'unauthenticated',
			user: null,
		})
	})

	it('should become unauthenticated when reading the session fails', async () => {
		supabaseMock.auth.getSession.mockRejectedValue(new Error('network'))

		await initAuth()

		expect(useAuthStore.getState().status).toBe('unauthenticated')
	})

	it('should subscribe only once when called repeatedly', async () => {
		await Promise.all([initAuth(), initAuth(), whenAuthReady()])

		expect(supabaseMock.auth.onAuthStateChange).toHaveBeenCalledTimes(1)
		expect(supabaseMock.auth.getSession).toHaveBeenCalledTimes(1)
	})

	it('should use full_name from the user metadata as the name', async () => {
		await initAuth()
		const session = sessionOf('u1', 'a@b.co')
		session.user.user_metadata = { full_name: 'Ana Souza' }

		emitAuthEvent('SIGNED_IN', session)

		expect(useAuthStore.getState().user?.name).toBe('Ana Souza')
	})

	it('should clear the store and the query cache on SIGNED_OUT', async () => {
		supabaseMock.auth.getSession.mockResolvedValue({
			data: { session: sessionOf('u1', 'a@b.co') },
		})
		await initAuth()
		queryClient.setQueryData(['favorites', 'u1'], ['1'])

		emitAuthEvent('SIGNED_OUT', null)

		expect(queryClient.getQueryData(['favorites', 'u1'])).toBeUndefined()
		expect(useAuthStore.getState()).toMatchObject({
			status: 'unauthenticated',
			user: null,
		})
	})
})

describe('signInWithEmail', () => {
	const credentials = { email: 'a@b.co', password: 'secret123' }

	it.each([
		['invalid_credentials', 'invalid_credentials'],
		['email_not_confirmed', 'email_not_confirmed'],
		['over_request_rate_limit', 'unknown'],
	])('should map the Supabase error %s to AuthFailure(%s)', async (supabaseCode, expected) => {
		supabaseMock.auth.signInWithPassword.mockResolvedValue({
			data: {},
			error: { code: supabaseCode, message: 'boom' },
		})

		await expect(signInWithEmail(credentials)).rejects.toMatchObject({
			name: 'AuthFailure',
			code: expected,
		})
	})

	it('should resolve when Supabase returns no error', async () => {
		await expect(signInWithEmail(credentials)).resolves.toBeUndefined()
		expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith(
			credentials,
		)
	})
})