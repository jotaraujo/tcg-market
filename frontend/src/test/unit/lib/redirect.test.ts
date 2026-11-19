import { safeRedirectPath } from '@/lib/redirect'

describe('safeRedirectPath', () => {
	it.each(['/favorites', '/card/123?setCode=LOB-EN001', '/authors'])(
		'should accept the internal path %s',
		(path) => {
			expect(safeRedirectPath(path)).toBe(path)
		},
	)

	it.each([
		'//evil.com',
		'https://evil.com',
		'/\\evil.com',
		'javascript:alert(1)',
		'/\t/evil.com',
		'',
		undefined,
		42,
	])('should fall back to /marketplace for %s', (input) => {
		expect(safeRedirectPath(input)).toBe('/marketplace')
	})

	it.each(['/login', '/login?redirect=%2Flogin', '/signup', '/auth/callback'])(
		'should not return %s (avoids redirect loops)',
		(path) => {
			expect(safeRedirectPath(path)).toBe('/marketplace')
		},
	)

	it('should use the custom fallback when given', () => {
		expect(safeRedirectPath('//evil.com', '/favorites')).toBe('/favorites')
	})
})