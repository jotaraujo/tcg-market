import type { YgoSet } from '@/types/set'

interface SetTileProps {
	set: YgoSet
	onSelect: (name: string) => void
}

const formatMonthYear = (isoDay: string) =>
	new Date(`${isoDay}T00:00:00Z`).toLocaleDateString('pt-BR', {
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	})

const formatCount = (count: number) =>
	`${count} ${count === 1 ? 'carta' : 'cartas'}`

// Cartão clicável de uma coleção. As artes da API vêm em proporções muito
// diferentes (de 0,5 a 2,5 de largura/altura), então todas entram na MESMA
// moldura 4:3 com `object-contain` e respiro: ninguém estoura o cartão nem some
// nele. Sem arte, o código ocupa o lugar e a altura do tile não muda.
//
// Hierarquia: o nome é o título (Space Grotesk, 2 linhas reservadas para os
// cartões da fileira terem a mesma altura); código/quantidade e data são
// metadados em Geist, no tamanho do corpo.
const SetTile = ({ set, onSelect }: SetTileProps) => {
	return (
		<button
			type='button'
			onClick={() => onSelect(set.set_name)}
			className='flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-card border border-rule bg-panel text-left transition-[background-color,transform] duration-(--dur-short) hover:bg-paper-3 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'
		>
			<div className='relative grid aspect-4/3 w-full place-items-center overflow-hidden bg-paper-2'>
				{set.set_image ? (
					<img
						src={set.set_image}
						alt=''
						loading='lazy'
						decoding='async'
						className='absolute inset-0 size-full object-contain p-md'
					/>
				) : (
					<span className='font-display text-xl font-semibold text-ink-2'>
						{set.set_code}
					</span>
				)}
			</div>
			<div className='flex flex-1 flex-col gap-xs p-md'>
				<span
					title={set.set_name}
					className='line-clamp-2 min-h-[2lh] font-display text-base leading-[1.15] font-semibold tracking-tight text-ink wrap-anywhere sm:text-md'
				>
					{set.set_name}
				</span>
				<span className='mt-auto flex flex-col text-base text-ink-2'>
					<span>
						{set.set_code} · {formatCount(set.num_of_cards)}
					</span>
					{set.tcg_date && <span>{formatMonthYear(set.tcg_date)}</span>}
				</span>
			</div>
		</button>
	)
}

export default SetTile
