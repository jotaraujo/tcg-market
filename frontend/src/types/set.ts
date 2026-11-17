// Coleção do endpoint cardsets.php da YGOPRODECK
export interface YgoSet {
	set_name: string
	set_code: string
	num_of_cards: number
	tcg_date?: string // AAAA-MM-DD; algumas coleções não têm data
	set_image?: string
}
