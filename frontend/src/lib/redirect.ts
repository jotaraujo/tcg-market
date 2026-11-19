const BLOCKED_PREFIXES = ['/login', '/signup', '/auth']

export function safeRedirectPath(
	input: unknown,
	fallback = '/marketplace',
): string {
	if (typeof input !== 'string') return fallback

	// Barra invertida e espaços/tab/quebra de linha: navegadores os tratam
	// como "/" ou os removem, o que reabre o caminho para "//evil.com".
	if (/[\s\\]/.test(input)) return fallback

	if (!input.startsWith('/') || input.startsWith('//')) return fallback

	const url = new URL(input, 'http://localhost')
	if (url.origin !== 'http://localhost') return fallback

	const isBlocked = BLOCKED_PREFIXES.some(
		(prefix) =>
			url.pathname === prefix || url.pathname.startsWith(`${prefix}/`),
	)
	if (isBlocked) return fallback

	return input
}
