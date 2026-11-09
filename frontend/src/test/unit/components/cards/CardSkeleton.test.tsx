import { render, screen } from '@testing-library/react'
import CardSkeleton from '@/components/cards/CardSkeleton'

describe('CardSkeleton', () => {
  it('renders three skeleton elements', () => {
    render(<CardSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')

    expect(skeletons).toHaveLength(3)
  }),
  
  it('renders image skeleton with correct aspect ratio', () => {
    render(<CardSkeleton />)

    const imageSkeleton = screen.getAllByTestId('skeleton')[0]

    expect(imageSkeleton).toHaveClass('aspect-3/4')
  }),

  it('renders title and subtitle skeletons', () => {
    render(<CardSkeleton />)

    const titleSkeleton = screen.getAllByTestId('skeleton')[1]
    const subtitleSkeleton = screen.getAllByTestId('skeleton')[2]

    expect(titleSkeleton).toHaveClass('h-4 w-3/4')
    expect(subtitleSkeleton).toHaveClass('h-3 w-1/2')
  })
})