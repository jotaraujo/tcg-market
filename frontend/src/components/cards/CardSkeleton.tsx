import Skeleton from '../ui/Skeleton'

// Espelha o CardItem (moldura, arte 2,5:3,5, nome, set e bloco de preço) para
// que a troca skeleton → carta não gere layout shift.
const CardSkeleton = () => {
	return (
		<div className='bg-panel rounded-card p-xs border border-rule flex flex-col gap-sm h-full'>
			<Skeleton
				data-testid='skeleton'
				className='aspect-card w-full rounded-md'
			/>
			<div className='flex flex-col gap-sm'>
				{/* As alturas das linhas (48 / 18 / 25px) são as medidas do CardItem:
				    o nome reserva 2 linhas; set e preço ocupam 1 linha de texto cada. */}
				<div className='h-12'>
					<Skeleton data-testid='skeleton' className='h-4 w-3/4' />
				</div>
				<div className='flex h-18px items-center'>
					<Skeleton data-testid='skeleton' className='h-3 w-1/2' />
				</div>
			</div>
			<div className='mt-auto pt-3 border-t border-rule'>
				<div className='flex h-25px items-center'>
					<Skeleton data-testid='skeleton' className='h-3 w-1/3' />
				</div>
			</div>
		</div>
	)
}

export default CardSkeleton
