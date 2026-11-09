import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorState from '@/components/ui/ErrorState'

describe('Test if Try Again button calls onRetry function when clicked', () => {
  it('renders ErrorState with onRetry mock', async () => {
    const user = userEvent.setup()
    const onRetryMock = vi.fn()
    const messageMock = 'An error occurred. Please try again.'
    render(<ErrorState message={messageMock} onRetry={onRetryMock} />)

    const button = screen.getByRole('button', { name: /Tentar Novamente/i })
    await user.click(button)

    expect(onRetryMock).toHaveBeenCalledTimes(1)
  }),

  it('should not renders the button when onRetry is not provided', () => {
    render(<ErrorState message={'Error'}/>)

    //O botão não deve ser renderizado
    const button = screen.queryByRole('button', { name: /Tentar Novamente/i })
    expect(button).toBeNull()
  }),

  it('should show loading spinner and disable the button when isRetrying is true', () => {
    const onRetryMock = vi.fn()
    render(<ErrorState message={'Error'} onRetry={onRetryMock} isRetrying={true} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })
})