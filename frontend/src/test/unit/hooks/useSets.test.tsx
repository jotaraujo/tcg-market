import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { useSets } from '@/hooks/useSets'
import { setsFixture } from '@/test/mocks/fixtures/sets'

const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider
		client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
	>
		{children}
	</QueryClientProvider>
)

describe('useSets', () => {
	it('should expose the sets once loaded', async () => {
		const { result } = renderHook(() => useSets(), { wrapper })

		await waitFor(() => expect(result.current.data).toEqual(setsFixture))
	})
})
