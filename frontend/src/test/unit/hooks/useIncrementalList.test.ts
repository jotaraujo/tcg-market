import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useIncrementalList } from '@/hooks/useIncrementalList'

const items = Array.from({ length: 10 }, (_, i) => i)

describe('useIncrementalList', () => {
	it('should show only the first batch at the start', () => {
		const { result } = renderHook(() => useIncrementalList(items, 4))

		expect(result.current.visible).toEqual([0, 1, 2, 3])
		expect(result.current.hasMore).toBe(true)
	})

	it('should show one more batch each time loadMore is called', () => {
		const { result } = renderHook(() => useIncrementalList(items, 4))

		act(() => result.current.loadMore())

		expect(result.current.visible).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
	})

	it('should stop at the end of the list', () => {
		const { result } = renderHook(() => useIncrementalList(items, 4))

		act(() => result.current.loadMore())
		act(() => result.current.loadMore())

		expect(result.current.visible).toEqual(items)
		expect(result.current.hasMore).toBe(false)
	})

	it('should have nothing more for a list shorter than a batch', () => {
		const { result } = renderHook(() => useIncrementalList([1, 2], 4))

		expect(result.current.visible).toEqual([1, 2])
		expect(result.current.hasMore).toBe(false)
	})
})
