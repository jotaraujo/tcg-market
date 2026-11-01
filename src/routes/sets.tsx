import { createFileRoute } from '@tanstack/react-router'
import SetsPage from '@/pages/SetsPage'

export const Route = createFileRoute('/sets')({
  component: SetsRoute,
})

function SetsRoute() {
  return <SetsPage />
}