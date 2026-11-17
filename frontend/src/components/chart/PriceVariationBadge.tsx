import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { PriceVariation } from '@/lib/priceVariation'
import { cn } from '@/lib/utils'

const percentOptions = {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
} as const

// Na tela o número leva o sinal (+18,6%); no rótulo falado o sinal vira palavra
// ("Alta de 18,6%"), então são dois formatadores.
const formatSigned = new Intl.NumberFormat('pt-BR', {
	...percentOptions,
	signDisplay: 'exceptZero',
})
const formatUnsigned = new Intl.NumberFormat('pt-BR', percentOptions)

const CONFIG = {
	up: {
		Icon: TrendingUp,
		label: 'Alta',
		className: 'bg-success/15 text-success',
	},
	down: {
		Icon: TrendingDown,
		label: 'Queda',
		className: 'bg-danger/15 text-danger',
	},
	flat: {
		Icon: Minus,
		label: 'Sem variação',
		className: 'bg-muted text-ink-2',
	},
} as const

interface PriceVariationBadgeProps {
	variation: PriceVariation
}

// Cor nunca é o único sinal: ícone (↑ ↓ −) + sinal no número + rótulo para o
// leitor de tela.
export const PriceVariationBadge = ({
	variation,
}: PriceVariationBadgeProps) => {
	const { Icon, label, className } = CONFIG[variation.direction]

	return (
		<span
			role='img'
			aria-label={
				variation.direction === 'flat'
					? label
					: `${label} de ${formatUnsigned.format(Math.abs(variation.percent))}%`
			}
			className={cn(
				'inline-flex items-center gap-2xs rounded-pill px-sm py-2xs font-outlier text-sm font-medium',
				className,
			)}
		>
			<Icon aria-hidden='true' className='size-4' />
			{formatSigned.format(variation.percent)}%
		</span>
	)
}
