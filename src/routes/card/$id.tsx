import { createFileRoute } from '@tanstack/react-router'
import CardDetailPage from '@/pages/CardDetailPage'

export const Route = createFileRoute('/card/$id')({
  component: CardDetailRoute,
})

function CardDetailRoute() {
  const { id } = Route.useParams()
  return <CardDetailPage id={id} />
}