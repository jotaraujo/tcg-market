import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

describe('useDebouncedValue', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should start with the initial value', () => {
		const { result } = renderHook(() => useDebouncedValue('a', 300))

		expect(result.current).toBe('a')
	})

	it('should only update after the delay', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 300),
			{ initialProps: { value: 'a' } },
		)

		rerender({ value: 'ab' })
		expect(result.current).toBe('a')

		act(() => {
			vi.advanceTimersByTime(300)
		})
		expect(result.current).toBe('ab')
	})

	it('should restart the timer on every change, skipping the intermediate values', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 300),
			{ initialProps: { value: 'a' } },
		)

		rerender({ value: 'ab' })
		act(() => {
			vi.advanceTimersByTime(200)
		})
		rerender({ value: 'abc' })
		act(() => {
			vi.advanceTimersByTime(200)
		})
		// 400ms desde a primeira mudança, mas só 200ms desde a última
		expect(result.current).toBe('a')

		act(() => {
			vi.advanceTimersByTime(100)
		})
		expect(result.current).toBe('abc')
	})
})
