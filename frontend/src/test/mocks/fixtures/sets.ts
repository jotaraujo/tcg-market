import type { YgoSet } from '@/types/set'

export const SETS_URL = 'https://db.ygoprodeck.com/api/v7/cardsets.php'

const image = (code: string) => `https://example.com/sets/${code}.jpg`

/**
 * Coleções fixas para os testes. Os nomes "Starter Deck" e "Legendary
 * Collection" batem com o `card_sets` de `makeCard`, então o handler do
 * cardinfo acha cartas para elas. As datas são fixas: uma sem data e uma em
 * 2099 cobrem as regras de "sem data" e "não lançada".
 */
export const setsFixture: YgoSet[] = [
	{
		set_name: 'Starter Deck',
		set_code: 'SD1',
		num_of_cards: 45,
		tcg_date: '2004-03-01',
		set_image: image('SD1'),
	},
	{
		set_name: 'Legendary Collection',
		set_code: 'LC01',
		num_of_cards: 45,
		tcg_date: '2013-06-12',
	},
	{
		set_name: 'Duelist Pack: Test',
		set_code: 'DP99',
		num_of_cards: 12,
		tcg_date: '2020-05-01',
		set_image: image('DP99'),
	},
	{
		set_name: 'Fresh Booster',
		set_code: 'FB01',
		num_of_cards: 100,
		tcg_date: '2025-10-10',
		set_image: image('FB01'),
	},
	{
		set_name: 'Tins & Boxes: Test',
		set_code: 'TB01',
		num_of_cards: 9,
		tcg_date: '2025-11-01',
		set_image: image('TB01'),
	},
	{
		set_name: 'Undated Promo',
		set_code: 'PROMO',
		num_of_cards: 3,
	},
	{
		set_name: 'Future Booster',
		set_code: 'FUT1',
		num_of_cards: 1,
		tcg_date: '2099-01-01',
		set_image: image('FUT1'),
	},
]
