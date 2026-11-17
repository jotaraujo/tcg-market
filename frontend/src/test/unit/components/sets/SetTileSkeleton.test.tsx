import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SetTileSkeleton from '@/components/sets/SetTileSkeleton'

describe('SetTileSkeleton', () => {
	it('should reserve the same 4:3 art frame as the real tile', () => {
		render(<SetTileSkeleton />)

		expect(screen.getAllByTestId('skeleton')[0]).toHaveClass('aspect-4/3')
	})
})
