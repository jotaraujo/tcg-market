import { createFileRoute } from '@tanstack/react-router'
import VerifyEmailPage from '@/pages/VerifyEmailPage'

export const Route = createFileRoute('/verify-email')({
  validateSearch: (search: Record<string, unknown>): { email?: string } => ({
    email: typeof search.email === 'string' ? search.email : undefined,
  }),
  component: VerifyEmailRoute,
})

function VerifyEmailRoute() {
  const { email } = Route.useSearch()
  return <VerifyEmailPage email={email} />
}