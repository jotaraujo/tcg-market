import { render, screen, waitFor } from '@testing-library/react'
import CardDetail from '@/pages/CardDetail'
import { useTCGData } from '@/hooks/useTCGData'

vi.mock('@/hooks/useTCGData', () => ({
  __esModule: true,
  default: vi.fn(),
}))
const mockUseTCGData = useTCGData as unknown as ReturnType<typeof vi.fn>

vi.mock('@/components/chart/PriceHistoryChart', () => ({
  __esModule: true,
  default: ({ data }: { data: any[] }) => <div data-testid='price-history-chart' />,
}))

describe('CardDetailPage', () => {
  beforeEach(() => {
    mockUseTCGData.mockReset()
  })

  it('should render loading state while fetching data', () => {
    mockUseTCGData.mockReturnValue({ isLoading: true, isError: false, data: null })
    render(<CardDetail />)

    expect(screen.getByText(/Carregando detalhes da carta/i)).toBeInTheDocument()
  })

  it('should render error state when there is an error', () => {
    mockUseTCGData.mockReturnValue({ isLoading: false, isError: true, data: null })
    render(<CardDetail />)

    expect(screen.getByText(/Não foi possível carregar os dados da carta/i)).toBeInTheDocument()
  })

  it('should render card details and price history when data is available', async () => {
    const mockCardData = {
      metadata: {
        id: '123',
        name: 'Blue-Eyes White Dragon',
        type: 'Normal Monster',
        race: 'Dragon',
        attribute: 'LIGHT',
        level: 8,
        atk: 3000,
        def: 2500,
        imageUrl: 'https://example.com/card.jpg',
        currentPrice: '100.00',
      },
      priceHistory: [
        { date: '2026-11-01', price: 95 },
        { date: '2026-11-02', price: 98 },
      ],
      source: 'proxy-v1',
    }

    mockUseTCGData.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockCardData,
    })

    render(<CardDetail />)

    await waitFor(() => {
      expect(screen.getByText(/Blue-Eyes White Dragon/i)).toBeInTheDocument()
      expect(screen.getByText(/ATK: 3000/i)).toBeInTheDocument()
      expect(screen.getByText(/DEF: 2500/i)).toBeInTheDocument()
      expect(screen.getByText(/100\.00/i)).toBeInTheDocument()
      expect(screen.getByTestId('price-history-chart')).toBeInTheDocument()
    })
  })
})