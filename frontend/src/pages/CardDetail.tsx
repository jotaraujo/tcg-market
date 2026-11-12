// src/pages/CardDetail.tsx
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'
import { PriceHistorySection } from '@/components/chart/PriceHistorySection'
import { useTCGData } from '@/hooks/useTCGData'
import type { Printing } from '@/types/proxy'

const fmtPrice = (v: string | number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v) || 0)

const printingKey = (p: Pick<Printing, 'setCode' | 'rarity'>) => `${p.setCode}|${p.rarity}`

const CardDetail = () => {
  const { id } = useParams({ from: '/card/$id' })
  const { setCode, rarity } = useSearch({ from: '/card/$id' })
  const navigate = useNavigate({ from: '/card/$id' })

  const { data, isLoading, isError, isPlaceholderData } = useTCGData(id, { setCode, rarity })

  if (isLoading) return <LoadingState message='Carregando detalhes da carta...' />
  if (isError || !data) return <ErrorState message='Não foi possível carregar os dados da carta.' />

  const { metadata, selectedPrinting, printings, priceHistory, priceHistoryStatus } = data
  const latestPrice = priceHistoryStatus === 'ok' ? priceHistory.at(-1)?.price : undefined

  const handlePrintingChange = (key: string) => {
    const next = printings.find((p) => printingKey(p) === key)
    if (next) navigate({ search: { setCode: next.setCode, rarity: next.rarity }, replace: true })
  }

  return (
    <div className='container grid grid-cols-1 md:grid-cols-2 mx-auto p-4 gap-8'>
      <div className='flex flex-col items-center'>
        <img src={metadata.imageUrl} alt={metadata.name} className='w-64 rounded-lg shadow-2xl' loading='lazy' />
        <h2 className='text-3xl font-bold mt-4'>{metadata.name}</h2>
        <div className='flex gap-4 mt-2 text-gray-600'>
          {metadata.atk !== undefined && <span>ATK: {metadata.atk}</span>}
          {metadata.def !== undefined && <span>DEF: {metadata.def}</span>}
        </div>
      </div>

      <div className='bg-white p-6 rounded-xl shadow-sm border' aria-busy={isPlaceholderData}>
        <h3 className='text-xl font-semibold mb-4'>Detalhes da Carta</h3>
        <dl className='grid grid-cols-2 gap-2 text-sm mb-6'>
          <dt className='font-medium text-gray-500'>Tipo</dt>
          <dd>{metadata.type}</dd>
          <dt className='font-medium text-gray-500'>Raça</dt>
          <dd>{metadata.race}</dd>
          {metadata.attribute && (<><dt className='font-medium text-gray-500'>Atributo</dt><dd>{metadata.attribute}</dd></>)}
          {metadata.level !== undefined && (<><dt className='font-medium text-gray-500'>Nível</dt><dd>{metadata.level}</dd></>)}
          <dt className='font-medium text-gray-500'>
            {latestPrice !== undefined ? 'Último preço (Near Mint)' : 'Preço (menor entre versões)'}
          </dt>
          <dd className='font-bold text-green-600'>{fmtPrice(latestPrice ?? metadata.currentPrice)}</dd>
        </dl>

        {printings.length > 0 && (
          <div className='mb-6'>
            <label htmlFor='printing' className='block text-sm font-medium text-gray-500 mb-1'>Impressão</label>
            <select
              id='printing'
              className='w-full border rounded-md px-2 py-1 text-sm'
              value={selectedPrinting ? printingKey(selectedPrinting) : ''}
              onChange={(e) => handlePrintingChange(e.target.value)}
            >
              {printings.map((p) => (
                <option key={printingKey(p)} value={printingKey(p)}>
                  {p.setCode} · {p.rarity} ({p.setName})
                </option>
              ))}
            </select>
          </div>
        )}

        <h3 className='text-xl font-semibold mb-4'>Histórico de Preço (30 dias)</h3>
        <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : undefined}>
          <PriceHistorySection status={priceHistoryStatus} history={priceHistory} />
        </div>
      </div>
    </div>
  )
}

export default CardDetail