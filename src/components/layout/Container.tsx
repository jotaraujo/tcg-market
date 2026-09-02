import { useState } from "react"
import CardGrid from "../cards/CardGrid"
import type { CardFilters } from "@/types/filters"

const Container = () => {
  const [filters, setFilters] = useState<Omit<CardFilters, 'num' | 'offset'>>({})

  return (
    <main className="flex flex-col items-center w-full gap-6">
      <header className="mb-6">
        <h1 className="text-2xl font-outlier font-bold text-ink">
          TCG Market
        </h1>
      </header>

      <CardGrid filters={filters}/>
    </main>
  )
}

export default Container