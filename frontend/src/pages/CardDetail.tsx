import { useParams } from '@tanstack/react-router'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'
import { useCardById } from '@/hooks/useCardById'
import { usePriceHistory } from '@/hooks/usePriceHistory'
import {
	LineChart,
	Line,
	XAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	YAxis,
} from 'recharts'

const CardDetail = () => {
	const { id } = useParams({ strict: false })

	const {
		data: card,
		isLoading: cardLoading,
		isError: cardError,
	} = useCardById(id)
	const {
		data: history,
		isLoading: historyLoading,
		isError: historyError,
	} = usePriceHistory(id)

	if (cardLoading) {
		return <LoadingState message='Carregando detalhes da carta...' />
	}

	if (cardError) {
		return <ErrorState message='Não foi possível carregar os dados da carta.' />
	}

	if (card) {
		return (
			<div className='container grid grid-cols-1 md:grid-cols-2 mx-auto p-4 gap-8'>
				{/* COLUNA 1: IMAGEM e INFO */}
				<div className='flex flex-col items-center'>
					<img
						src={card.card_images?.[0]?.image_url}
						alt={card.name}
						className='w-64 rounded-lg shadow-2xl'
					/>
					<h2 className='text-3xl font-bold mt-4'>{card.name}</h2>
					<div className='flex gap-4 mt-2 text-gray-600'>
						<span>ATK: {card.atk}</span>
						<span>DEF: {card.def}</span>
					</div>
				</div>
				<div className='bg-white p-6 rounded-xl shadow-sm border'>
					<h3 className='text-xl font-semibold mb-4'>Histórico de Preço</h3>
					{historyLoading ? (
						<div className='flex items-center justify-center h-300px'>
							<LoadingState message='Carregando histórico...' />
						</div>
					) : historyError ? (
						<div className='flex items-center justify-center h-300px'>
							<ErrorState message='Histórico indisponível no momento.' />
						</div>
					) : (
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={history}>
								<CartesianGrid />
								<XAxis dataKey='date' />
								<YAxis />
								<Tooltip />
								<Line
									type='monotone'
									dataKey='price'
									stroke='#3b82f6'
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					)}
				</div>
			</div>
		)
	}
}

export default CardDetail
