import { createFileRoute } from '@tanstack/react-router'
import MarketplacePage from '@/pages/MarketplacePage'

export const Route = createFileRoute('/marketplace')({
  component: MarketplaceRoute,
})

function MarketplaceRoute() {
  return <MarketplacePage />
}