import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth'

interface Card {
  id: string
  name: string
  imageUrl: string
  desc: string
  archetype: string
  type: string
  attribute: string
  level: number
  attack: number
  defense: number
  atk_desc: string
  def_desc: string
}

export default function CardDetailPage() {
  const { id } = useParams({ strict: false })
  const [card, setCard] = useState<Card | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('No card ID provided')
      setIsLoading(false)
      return
    }

    const fetchCard = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/yugioh/card/${id}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch card: ${response.status}`)
        }

        const data = await response.json()
        setCard(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCard()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading card details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p>Error loading card: {error}</p>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Card not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-96 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-card.png'
            }}
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{card.name}</h1>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Type: {card.type}</p>
              <p className="text-sm text-gray-600">Attribute: {card.attribute}</p>
              <p className="text-sm text-gray-600">Level: {card.level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Attack: {card.attack}</p>
              <p className="text-sm text-gray-600">Defense: {card.defense}</p>
              <p className="text-sm text-gray-600">Archetype: {card.archetype}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">Description: {card.desc}</p>
          </div>

          {card.atk_desc && (
            <div className="mb-2">
              <p className="text-sm font-semibold">Attack Description: {card.atk_desc}</p>
            </div>
          )
          }

          {card.def_desc && (
            <div className="mb-4">
              <p className="text-sm font-semibold">Defense Description: {card.def_desc}</p>
            </div>
          )
          }
        </div>
      </div>
    </div>
  )
}