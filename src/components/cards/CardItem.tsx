import type { Card, CardImage } from '@/types/card'

interface CardItemProps {
	card: Card
	image: CardImage
}

const CardItem = ({ card, image }: CardItemProps) => {
	const imageUrl = image?.image_url_small
	const lastestSet = card.card_sets?.[card.card_sets.length - 1]
	const setName = lastestSet?.set_name ?? 'A ser lançado'
	const setRarity = lastestSet?.set_rarity ?? 'N/A'
	const setPrice = lastestSet?.set_price ?? 'N/A'

	return (
		<article className='flex flex-col items-center max-w-6xl max-h-8xl rounded-card border border-muted bg-card gap-xs'>
			<div className='max-w-5xl'>
				{imageUrl && (
					<img
						src={imageUrl}
						alt={card.name}
						className='rounded-card'
						loading='lazy'
					/>
				)}
			</div>
			<div className='flex flex-1 flex-col gap-xs'>
				<h3
					className='line-clamp-1 font-semibold text-ink text-sm'
					title={card.name}
				>
					{card.name}
				</h3>

				<span className='text-sm text-muted border-b border-rule pb-4' title={setName}>
				Set: {setName} - {setRarity}
				</span>

				<div className='mt-auto flex gap-3 pt-2 text-sm font-medium'>
					<p className='text-blue-600'>Preço: {setPrice}</p>
				</div>
			</div>
		</article>
	)
}

export default CardItem
