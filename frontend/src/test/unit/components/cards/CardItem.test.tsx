import { render, screen } from '@testing-library/react'
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

	describe('preço', () => {
		const cardWithoutPrice: Card = {
			...card,
			card_prices: [],
			card_sets: [],
		}

		it('should show the price in USD when there is no exchange rate', () => {
			render(<CardItem card={card} image={image} />)
			expect(screen.getByText('$0.33')).toBeInTheDocument()
			expect(screen.queryByText(/R\$/)).not.toBeInTheDocument()
		})

		it('should show the price converted to BRL when the rate is provided', () => {
			render(<CardItem card={card} image={image} rate={5} />)
			// 0.33 * 5 = 1.65. O Intl usa espaço não separável entre "R$" e o
			// número, por isso a regex em vez do texto exato.
			expect(screen.getByText(/R\$\s*1,65/)).toBeInTheDocument()
			expect(screen.queryByText('$0.33')).not.toBeInTheDocument()
		})

		it('should show "Sem preço" when the card has no price', () => {
			render(<CardItem card={cardWithoutPrice} image={image} />)
			expect(screen.getByText('Sem preço')).toBeInTheDocument()
		})

		it('should keep "Sem preço" even when the rate is provided', () => {
			render(<CardItem card={cardWithoutPrice} image={image} rate={5} />)
			expect(screen.getByText('Sem preço')).toBeInTheDocument()
			expect(screen.queryByText(/R\$/)).not.toBeInTheDocument()
		})
	})

	describe('conteúdo', () => {
		it('should show only the set name, without the "Set:" prefix or the rarity', () => {
			render(<CardItem card={card} image={image} />)
			expect(screen.getByText('2016 Mega-Tins')).toBeInTheDocument()
			expect(screen.queryByText(/Set:/)).not.toBeInTheDocument()
			expect(screen.queryByText(/Ultra Rare/)).not.toBeInTheDocument()
		})

		it('should show "A ser lançado" when the card has no sets', () => {
			render(<CardItem card={{ ...card, card_sets: [] }} image={image} />)
			expect(screen.getByText('A ser lançado')).toBeInTheDocument()
		})

		it('should not render the "Preço:" label', () => {
			render(<CardItem card={card} image={image} />)
			expect(screen.queryByText('Preço:')).not.toBeInTheDocument()
		})

		it('should expose the full name in the title attribute', () => {
			const longName = 'A'.repeat(80)
			render(<CardItem card={{ ...card, name: longName }} image={image} />)
			expect(screen.getByTitle(longName)).toBeInTheDocument()
		})
	})

	describe('imagem', () => {
		// alt vazio dá role "presentation", então queryByRole('img') não enxerga
		// a tag: procuramos direto no DOM.
		const getImg = (container: HTMLElement) => container.querySelector('img')

		it('should not render image when it is not provided', () => {
			const imageWithoutUrl = { ...image, image_url_small: undefined }
			const { container } = render(
				<CardItem card={card} image={imageWithoutUrl} />,
			)
			expect(getImg(container)).not.toBeInTheDocument()
		})

		it('should render the art as decorative so the name is not read twice', () => {
			const { container } = render(<CardItem card={card} image={image} />)
			expect(getImg(container)).toHaveAttribute('alt', '')
			// o nome continua acessível uma única vez, no heading
			expect(
				screen.getAllByText('Dark Magician', { exact: true }),
			).toHaveLength(1)
		})

		it('should lazy-load the art by default', () => {
			const { container } = render(<CardItem card={card} image={image} />)
			expect(getImg(container)).toHaveAttribute('loading', 'lazy')
		})

		it('should load the art eagerly with high priority when priority is set', () => {
			const { container } = render(
				<CardItem card={card} image={image} priority />,
			)
			expect(getImg(container)).toHaveAttribute('loading', 'eager')
			expect(getImg(container)).toHaveAttribute('fetchpriority', 'high')
		})
	})

	it('should let the name use two lines so similar cards stay distinguishable', () => {
		render(<CardItem card={card} image={image} />)
		expect(screen.getByRole('heading', { name: 'Dark Magician' })).toHaveClass(
			'line-clamp-2',
		)
	})
})
