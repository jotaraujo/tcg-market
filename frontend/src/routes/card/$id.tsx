import { createFileRoute } from '@tanstack/react-router'
import CardDetail from '@/pages/CardDetail'

export const Route = createFileRoute('/card/$id')({
  component: CardDetail,
})