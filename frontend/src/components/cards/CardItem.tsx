import { getCardPriceUsd } from '@/lib/pricing'
import type { Card, CardImage } from '@/types/card'

interface CardItemProps {
	card: Card
	image?: CardImage
	rate?: number
	onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const formatUsd = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
})

const formatBrl = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
})

const CardItem = ({
	card,
	image,
	rate,
	onClick,
	...rest
}: CardItemProps) => {
	const imageUrl = image?.image_url_small
	const lastestSet = card.card_sets?.[card.card_sets.length - 1]
	const setName = lastestSet?.set_name ?? 'A ser lançado'
	const setRarity = lastestSet?.set_rarity ?? 'N/A'

	const priceUsd = getCardPriceUsd(card)
	let priceLabel: React.ReactNode
	if (priceUsd === null) {
		priceLabel = <span className='text-sm text-ink-2 mb-5'>Sem preço</span>
	}  else if (rate !== undefined) {
		priceLabel = (
			<span className='text-gold text-lg gold-glow'>
				{formatBrl.format(priceUsd * rate)}
			</span>
		)
	} else {
		priceLabel = (
			<span className='text-gold text-lg gold-glow'>
				{formatUsd.format(priceUsd)}
			</span>
		)
	}

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
					{priceLabel}
				</div>
			</div>
		</article>
	)
}

export default CardItem
