import { render, screen } from '@testing-library/react'
import LoadingState from '@/components/ui/LoadingState'

describe('', () => {
  it('renders the loading message based on the message prop', () => {
    const messageMock = 'Loading data...'

    render(<LoadingState message={messageMock} />)

    expect(screen.getByText(messageMock)).toBeInTheDocument()
  }),

  it('renders the spinner icon', () => {
    const messageMock = 'Loading data...'

    render(<LoadingState message={messageMock} />)

    const spinner = screen.getByTestId('spinner')

    expect(spinner).toBeInTheDocument()
  })
})