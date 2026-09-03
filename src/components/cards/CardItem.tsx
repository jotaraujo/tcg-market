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
	//
	return (
		<article className='bg-panel rounded-lg p-xs border border-rule flex flex-col gap-sm card-hover cursor-pointer'>
			<div className='relative w-full aspect-card rounded-md overflow-hidden'>
				{imageUrl && (
					<img
						src={imageUrl}
						alt={card.name}
						className='rounded-md w-full h-full'
						loading='lazy'
					/>
				)}
			</div>
			<div className='flex flex-col grow gap-sm'>
				<h3
					className='font-sans font-medium text-body text-ink line-clamp-1'
					title={card.name}
				>
					{card.name}
				</h3>
				<p className='font-sans text-sm text-muted line-clamp-1'>
					Set: {setName} • {setRarity}
				</p>
			</div>

			<div className='flex items-end justify-between mt-auto pt-3 border-t border-rule'>
				<div className='flex flex-col'>
					<span className='text-gold text-md gold-glow'>Preço:</span>
					<span className='text-gold text-lg gold-glow'>$ {setPrice}</span>
				</div>
			</div>
		</article>
	)
}

export default CardItem
