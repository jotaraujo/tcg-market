import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import type { PriceHistoryEntry } from '@/types/proxy'

interface Props {
	data: PriceHistoryEntry[]
}

const fmtPrice = (v: number) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(v)

// "07/11": curto o bastante para o eixo X não encavalar no mobile
const fmtDate = (iso: string) =>
	new Date(iso).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		timeZone: 'UTC',
	})

// Cores vêm dos tokens (globals.css): linha = accent, grade = rule, tooltip =
// gold (preço é o único dado dourado do sistema). Fundo transparente: o painel
// que envolve o gráfico faz o trabalho.
const AXIS = {
	tick: { fill: 'var(--color-ink-2)', fontSize: 12 },
	tickLine: false,
	axisLine: { stroke: 'var(--color-rule)' },
} as const

export const PriceHistoryChart = ({ data }: Props) => {
	if (!data || data.length === 0) {
		return (
			<div className='flex h-[300px] items-center justify-center text-ink-2'>
				Histórico de preços indisponível para esta carta.
			</div>
		)
	}

	const chartData = data.map((p) => ({
		date: fmtDate(p.date),
		price: p.price,
	}))

	return (
		<ResponsiveContainer width='100%' height={300}>
			<LineChart
				data={chartData}
				margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
			>
				<CartesianGrid stroke='var(--color-rule)' vertical={false} />
				<XAxis dataKey='date' {...AXIS} />
				<YAxis
					{...AXIS}
					domain={['auto', 'auto']}
					tickFormatter={(v: number | undefined) =>
						v === undefined ? '' : `$${v.toFixed(2)}`
					}
					width={64}
				/>
				<Tooltip
					cursor={{ stroke: 'var(--color-rule)' }}
					contentStyle={{
						background: 'var(--color-paper-3)',
						border: '1px solid var(--color-rule)',
						borderRadius: 'var(--radius-input)',
						color: 'var(--color-ink)',
					}}
					labelStyle={{ color: 'var(--color-ink-2)' }}
					itemStyle={{
						color: 'var(--color-gold)',
						fontFamily: 'var(--font-outlier)',
					}}
					formatter={
						((value: any) => [
							fmtPrice(Number(Array.isArray(value) ? value[0] : value) || 0),
							'Preço',
						]) as any
					}
					labelFormatter={((label: React.ReactNode) => `Data: ${label}`) as any}
				/>
				<Line
					type='monotone'
					dataKey='price'
					stroke='var(--color-primary)'
					strokeWidth={2}
					dot={{
						r: 3,
						fill: 'var(--color-primary)',
						stroke: 'var(--color-paper-2)',
						strokeWidth: 2,
					}}
					activeDot={{
						r: 5,
						fill: 'var(--color-gold)',
						stroke: 'var(--color-paper-2)',
						strokeWidth: 2,
					}}
				/>
			</LineChart>
		</ResponsiveContainer>
	)
}
