export interface AuthCallbackError {
  code: string,
  description: string | null
}

export function parseAuthCallbackError(url: { search: string, hash: string }): AuthCallbackError | null {
  for (const raw of [url.search, url.hash]) {
    const params = new URLSearchParams(raw.replace(/^[?#]/, ''))
    const code = params.get('error_code') ?? params.get('error')
    const description = params.get('error_description')
    if (code || description) {
      return { code: code ?? 'unknown', description }
    }
  }
  return null
}