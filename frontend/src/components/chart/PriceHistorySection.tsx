import { PriceHistoryChart } from '@/components/chart/PriceHistoryChart'
import type { PriceHistoryEntry, PriceHistoryStatus } from '@/types/proxy'

const MESSAGES: Record<Exclude<PriceHistoryStatus, 'ok'>, string> = {
  not_found: 'Esta impressão ainda não tem histórico de preços.',
  no_match: 'Não encontramos preços para esta raridade. Tente outra impressão.',
  ambiguous: 'Há mais de uma versão com este código; não foi possível identificar o preço com segurança.',
  unavailable: 'Serviço de preços indisponível no momento. Tente novamente mais tarde.',
}

interface Props {
  status: PriceHistoryStatus
  history: PriceHistoryEntry[]
}

export const PriceHistorySection = ({ status, history }: Props) => {
  if (status === 'ok') return <PriceHistoryChart data={history} />
  return (
    <p role={status === 'unavailable' ? 'alert' : 'status'} className='text-gray-500'>
      {MESSAGES[status]}
    </p>
  )
}