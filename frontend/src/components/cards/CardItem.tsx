import { getCardPriceUsd } from '@/lib/pricing'
import type { Card, CardImage } from '@/types/card'

interface CardItemProps {
	card: Card
	image?: CardImage
	rate?: number
	// Cartas da primeira dobra: imagem carregada na hora (melhora o LCP).
	priority?: boolean
}

const formatUsd = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
})

const formatBrl = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
})

const CardItem = ({ card, image, rate, priority = false }: CardItemProps) => {
	const imageUrl = image?.image_url_small
	const lastestSet = card.card_sets?.[card.card_sets.length - 1]
	const setName = lastestSet?.set_name ?? 'A ser lançado'

	const priceUsd = getCardPriceUsd(card)
	let priceLabel: React.ReactNode
	if (priceUsd === null) {
		priceLabel = <span className='text-base text-ink-2'>Sem preço</span>
	} else if (rate !== undefined) {
		priceLabel = (
			<span className='font-outlier text-base text-gold gold-glow'>
				{formatBrl.format(priceUsd * rate)}
			</span>
		)
	} else {
		priceLabel = (
			<span className='font-outlier text-base text-gold gold-glow'>
				{formatUsd.format(priceUsd)}
			</span>
		)
	}

	return (
		<article className='bg-panel rounded-card p-xs border border-rule flex flex-col gap-sm h-full card-hover'>
			<div className='relative w-full aspect-card rounded-md overflow-hidden'>
				{imageUrl && (
					// alt vazio: o nome da carta já está no texto logo abaixo, então a
					// arte é decorativa (evita o leitor de tela ler o nome duas vezes).
					<img
						src={imageUrl}
						alt=''
						className='rounded-md w-full h-full'
						loading={priority ? 'eager' : 'lazy'}
						fetchPriority={priority ? 'high' : 'auto'}
						decoding='async'
					/>
				)}
			</div>
			<div className='flex flex-col grow gap-sm'>
				{/* 2 linhas reservadas: o que diferencia cartas da mesma família
				    ("Infernoble Arms - Almace/Durendal") fica no fim do nome. */}
				<h3
					className='font-body text-md font-medium text-ink line-clamp-2 min-h-[2lh]'
					title={card.name}
				>
					{card.name}
				</h3>
				<p className='font-body text-sm text-text-foreground line-clamp-1'>
					{setName}
				</p>
			</div>

			<div className='mt-auto pt-3 border-t border-rule'>{priceLabel}</div>
		</article>
	)
}

export default CardItem
