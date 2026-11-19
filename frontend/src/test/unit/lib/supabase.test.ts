describe('lib/supabase', () => {
	afterEach(() => {
		vi.unstubAllEnvs()
		vi.resetModules()
	})

	it('should throw a clear error when VITE_SUPABASE_URL is missing', async () => {
		vi.stubEnv('VITE_SUPABASE_URL', '')
		vi.resetModules()
		await expect(import('@/lib/supabase')).rejects.toThrow(/VITE_SUPABASE_URL/)
	})

	it('should throw a clear error when VITE_SUPABASE_PUBLISHABLE_KEY is missing', async () => {
		vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
		vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '')
		vi.resetModules()
		await expect(import('@/lib/supabase')).rejects.toThrow(
			/VITE_SUPABASE_PUBLISHABLE_KEY/,
		)
	})
})
