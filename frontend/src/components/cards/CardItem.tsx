import { getCardPriceUsd } from '@/lib/pricing'
import type { Card, CardImage } from '@/types/card'

interface CardItemProps {
	card: Card
	image?: CardImage
	onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const formatUsd = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
})

const CardItem = ({ card, image, onClick, ...rest }: CardItemProps) => {
	const imageUrl = image?.image_url_small
	const lastestSet = card.card_sets?.[card.card_sets.length - 1]
	const setName = lastestSet?.set_name ?? 'A ser lançado'
	const setRarity = lastestSet?.set_rarity ?? 'N/A'
	const priceUsd = getCardPriceUsd(card)
	//
	return (
		<article
			{...rest}
			className='bg-panel rounded-lg p-xs border border-rule flex flex-col gap-sm card-hover cursor-pointer'
			onClick={onClick}
		>
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
					className='font-body font-medium text-ink line-clamp-1'
					title={card.name}
				>
					{card.name}
				</h3>
				<p className='font-body text-sm text-text-foreground line-clamp-1'>
					Set: {setName} • {setRarity}
				</p>
			</div>

			<div className='flex items-end justify-between mt-auto pt-3 border-t border-rule'>
				<div className='flex flex-col'>
					<span className='text-gold text-md gold-glow'>Preço:</span>
					{priceUsd !== null ? (
						<span className='text-gold text-lg gold-glow'>
							{formatUsd.format(priceUsd)}
						</span>
					) : (
						<span className='text-sm text-ink-2 mb-5'>Sem preço</span>
					)}
				</div>
			</div>
		</article>
	)
}

export default CardItem
