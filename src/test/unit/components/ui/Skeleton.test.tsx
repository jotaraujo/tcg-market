import { render, screen } from '@testing-library/react'
import Skeleton from '@/components/ui/Skeleton'

describe('Skeleton', () => {
  it('renders with default classes', () => {
    render(<Skeleton />)

    const skeleton = screen.getByTestId('skeleton')

    expect(skeleton).toHaveClass('animate-pulse')
    expect(skeleton).toHaveClass('rounded-md')
    expect(skeleton).toHaveClass('bg-muted')
  }),

  it('applies custom width and height', () => {
    render(<Skeleton width={100} height={50} />)

    const skeleton = screen.getByTestId('skeleton')

    expect(skeleton).toHaveStyle({ width: '100px', height: '50px' })
  }),

  it('merges additional className', () => {
    render(<Skeleton className='custom-class'/>)

    const skeleton = screen.getByTestId('skeleton')

    expect(skeleton).toHaveClass('custom-class')
  })
})