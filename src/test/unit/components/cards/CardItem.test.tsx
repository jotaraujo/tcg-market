import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardItem from '@/components/cards/CardItem'
import type { Card, CardImage } from '@/types/card'

const card: Card = {
	id: 46986414,
	name: 'Dark Magician',
	fname: 'Dark Magician',
	type: 'Normal Monster',
	race: 'Spellcaster',
	attribute: 'DARK',
	atk: 2500,
	def: 2100,
	level: 7,
	archetype: 'Dark Magician',
	typeline: ['Spellcaster', 'Normal'],
	humanReadableCardType: 'Normal Monster',
	frameType: 'normal',
	card_prices: [
		{
			tcgplayer_price: '0.33',
			ebay_price: '0.99',
			amazon_price: '14.45',
			coolstuffinc_price: '0.39',
		},
	],
	card_sets: [
		{
			set_name: '2016 Mega-Tins',
			set_code: 'CT13-EN003',
			set_rarity: 'Ultra Rare',
			set_rarity_code: '(UR)',
			set_price: '6.97',
		},
	],
}

const image: CardImage = {
	id: 46986414,
	image_url: 'https://images.ygoprodeck.com/images/cards/46986414.jpg',
	image_url_small:
		'https://images.ygoprodeck.com/images/cards_small/46986414.jpg',
	image_url_cropped:
		'https://images.ygoprodeck.com/images/cards_cropped/46986414.jpg',
}

describe('CardItem', () => {
	it('should render the card as an article element', () => {
		render(<CardItem card={card} image={image} />)
		expect(screen.getByRole('article')).toBeInTheDocument()
	})

	it('should show the correct name of the card', () => {
		render(<CardItem card={card} image={image} />)
		expect(screen.getByText('Dark Magician')).toBeInTheDocument()
	})

	it('should show the correct price of the card', () => {
		render(<CardItem card={card} image={image} />)
		expect(screen.getByText('$ 6.97')).toBeInTheDocument()
	})

	it('should not render image when it is not provided', () => {
		const imageWithoutUrl = { ...image, image_url_small: undefined }
		render(<CardItem card={card} image={imageWithoutUrl} />)
		expect(screen.queryByRole('img')).not.toBeInTheDocument()
	})

	it('should call onClick when card is clicked', async () => {
		const handleClick = vi.fn()
		render(<CardItem card={card} image={image} onClick={handleClick} />)
		await userEvent.click(screen.getByRole('article'))
		expect(handleClick).toHaveBeenCalledTimes(1)
	})
})