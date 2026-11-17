import Skeleton from '../ui/Skeleton'

// Espelha o CardItem (moldura, arte 2,5:3,5, nome, set e bloco de preço) para
// que a troca skeleton → carta não gere layout shift.
//
// As alturas das linhas não são números fixos: cada wrapper usa as MESMAS
// classes de fonte do texto que substitui e reserva a altura em `lh` (a
// altura de linha daquele texto). Se a tipografia do CardItem mudar, é só
// repetir a classe de fonte aqui.
const CardSkeleton = () => {
	return (
		<div className='bg-panel rounded-card p-xs border border-rule flex flex-col gap-sm h-full'>
			<Skeleton
				data-testid='skeleton'
				className='aspect-card w-full rounded-md'
			/>
			<div className='flex flex-col grow gap-sm'>
				{/* nome: 2 linhas reservadas, como o h3 do CardItem. O leading-[1.15]
				    repete a altura de linha dos headings (globals.css, @layer base):
				    um div não a herda e o `lh` sairia 16px maior. */}
				<div className='font-body text-md leading-[1.15] min-h-[2lh]'>
					<Skeleton data-testid='skeleton' className='h-4 w-3/4' />
				</div>
				{/* set: 1 linha */}
				<div className='flex items-center font-body text-sm h-[1lh]'>
					<Skeleton data-testid='skeleton' className='h-3 w-1/2' />
				</div>
			</div>
			{/* preço: o CardItem não define fonte no contêiner, então 1lh aqui é a
			    linha do corpo, igual ao bloco real */}
			<div className='mt-auto pt-3 border-t border-rule'>
				<div className='flex items-center h-[1lh]'>
					<Skeleton data-testid='skeleton' className='h-3 w-1/3' />
				</div>
			</div>
		</div>
	)
}

export default CardSkeleton
