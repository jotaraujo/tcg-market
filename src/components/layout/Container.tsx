import { useState } from "react"
import CardGrid from "../cards/CardGrid"
import type { CardFilters } from "@/types/filters"

const Container = () => {
  const [filters, setFilters] = useState<Omit<CardFilters, 'num' | 'offset'>>({})

  return (
    <main className="flex flex-col gap-6 w-full h-full p-6">
      <header>
        <h1 className="text-2xl font-outlier font-bold text-ink">
          TCG Market
        </h1>
      </header>

      <div className='flex flex-1 min-h-0 overflow-hidden'>
        <CardGrid filters={filters} />
      </div>
    </main>
  )
}

export default Container