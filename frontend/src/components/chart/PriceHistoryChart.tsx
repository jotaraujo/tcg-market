import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
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

const fmtDate = (iso: string) =>
	new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC',
	})

export const PriceHistoryChart = ({ data }: Props) => {
	if (!data || data.length === 0) {
		return (
			<div className='flex items-center justify-center h-300px text-gray-500'>
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
				margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
			>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='date' />
				<YAxis
					tickFormatter={(v: number | undefined) =>
						v === undefined ? '' : `$${v.toFixed(2)}`
					}
					width={60}
				/>
				<Tooltip
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
					stroke='#2563eb'
					strokeWidth={2}
					dot={{ r: 3 }}
					activeDot={{ r: 6 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	)
}
