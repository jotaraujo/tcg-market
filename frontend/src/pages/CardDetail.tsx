import { useParams } from '@tanstack/react-router'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'
import { PriceHistoryChart } from '@/components/chart/PriceHistoryChart'
import { useTCGData } from '@/hooks/useTCGData'

const fmtPrice = (v: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(v) || 0)

const CardDetail = () => {
  const { id } = useParams({ from: '/card/$id' })

  const { data, isLoading, isError } = useTCGData(id)

  if (isLoading) {
    return <LoadingState message='Carregando detalhes da carta...' />
  }

  if (isError || !data) {
    return <ErrorState message='Não foi possível carregar os dados da carta.' />
  }

  const { metadata, priceHistory } = data

  return (
    <div className='container grid grid-cols-1 md:grid-cols-2 mx-auto p-4 gap-8'>
      {/* COLUNA 1: IMAGEM e INFO */}
      <div className='flex flex-col items-center'>
        <img
          src={metadata.imageUrl}
          alt={metadata.name}
          className='w-64 rounded-lg shadow-2xl'
          loading='lazy'
        />
        <h2 className='text-3xl font-bold mt-4'>{metadata.name}</h2>
        <div className='flex gap-4 mt-2 text-gray-600'>
          <span>ATK: {metadata.atk}</span>
          <span>DEF: {metadata.def}</span>
        </div>
      </div>

      {/* COLUNA 2: DETALHES + GRÁFICO */}
      <div className='bg-white p-6 rounded-xl shadow-sm border'>
        <h3 className='text-xl font-semibold mb-4'>Detalhes da Carta</h3>
        <dl className='grid grid-cols-2 gap-2 text-sm mb-6'>
          <dt className='font-medium text-gray-500'>Tipo</dt>
          <dd>{metadata.type}</dd>
          <dt className='font-medium text-gray-500'>Raça</dt>
          <dd>{metadata.race}</dd>
          <dt className='font-medium text-gray-500'>Atributo</dt>
          <dd>{metadata.attribute}</dd>
          <dt className='font-medium text-gray-500'>Nível</dt>
          <dd>{metadata.level}</dd>
          <dt className='font-medium text-gray-500'>Preço Atual</dt>
          <dd className='font-bold text-green-600'>
            {fmtPrice(metadata.currentPrice)}
          </dd>
        </dl>

        <h3 className='text-xl font-semibold mb-4'>Histórico de Preço (7 dias)</h3>
        <PriceHistoryChart data={priceHistory} />
      </div>
    </div>
  )
}

export default CardDetail