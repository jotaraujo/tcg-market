import { parseAuthCallbackError } from '@/lib/authCallback'

describe('parseAuthCallbackError', () => {
	it('should read the error from the hash', () => {
		const error = parseAuthCallbackError({
			search: '',
			hash: '#error=access_denied&error_code=otp_expired',
		})

		expect(error?.code).toBe('otp_expired')
	})

	it('should read the error from the query string', () => {
		const error = parseAuthCallbackError({
			search: '?error=access_denied&error_code=otp_expired',
			hash: '',
		})

		expect(error?.code).toBe('otp_expired')
	})

	it('should fall back to the error field when there is no error_code', () => {
		const error = parseAuthCallbackError({
			search: '?error=access_denied',
			hash: '',
		})

		expect(error?.code).toBe('access_denied')
	})

	it('should decode the description', () => {
		const error = parseAuthCallbackError({
			search: '',
			hash: '#error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired',
		})

		expect(error?.description).toBe('Email link is invalid or has expired')
	})

	it('should use "unknown" when only a description is present', () => {
		const error = parseAuthCallbackError({
			search: '?error_description=Algo+deu+errado',
			hash: '',
		})

		expect(error).toEqual({ code: 'unknown', description: 'Algo deu errado' })
	})

	it('should accept values without the leading ? or #', () => {
		expect(
			parseAuthCallbackError({ search: 'error_code=otp_expired', hash: '' })
				?.code,
		).toBe('otp_expired')
		expect(
			parseAuthCallbackError({ search: '', hash: 'error_code=otp_expired' })
				?.code,
		).toBe('otp_expired')
	})

	it('should return null for a normal ?code= callback', () => {
		expect(parseAuthCallbackError({ search: '?code=abc', hash: '' })).toBeNull()
	})

	it('should return null when there is nothing in the URL', () => {
		expect(parseAuthCallbackError({ search: '', hash: '' })).toBeNull()
	})
})