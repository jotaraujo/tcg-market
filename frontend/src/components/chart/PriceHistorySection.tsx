import { AlertCircle, Info } from 'lucide-react'
import { PriceHistoryChart } from '@/components/chart/PriceHistoryChart'
import type { PriceHistoryEntry, PriceHistoryStatus } from '@/types/proxy'

const MESSAGES: Record<Exclude<PriceHistoryStatus, 'ok'>, string> = {
	not_found: 'Esta impressão ainda não tem histórico de preços.',
	no_match: 'Não encontramos preços para esta raridade. Tente outra impressão.',
	ambiguous:
		'Há mais de uma versão com este código; não foi possível identificar o preço com segurança.',
	unavailable:
		'Serviço de preços indisponível no momento. Tente novamente mais tarde.',
}

interface Props {
	status: PriceHistoryStatus
	history: PriceHistoryEntry[]
}

export const PriceHistorySection = ({ status, history }: Props) => {
	if (status === 'ok') return <PriceHistoryChart data={history} />

	// Só "unavailable" é falha de verdade; os outros são estados válidos (a carta
	// só não tem histórico), então não usam a cor de erro.
	const isFailure = status === 'unavailable'
	const Icon = isFailure ? AlertCircle : Info

	return (
		<p
			role={isFailure ? 'alert' : 'status'}
			className='flex min-h-[300px] items-center justify-center gap-sm rounded-input border border-dashed border-rule px-lg text-center text-ink-2'
		>
			<Icon
				aria-hidden='true'
				className={
					isFailure ? 'size-5 shrink-0 text-danger' : 'size-5 shrink-0'
				}
			/>
			{MESSAGES[status]}
		</p>
	)
}
