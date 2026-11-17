import Skeleton from '../ui/Skeleton'

// Espelha o SetTile (moldura 4:3 da arte, nome em 2 linhas, 2 linhas de
// metadados) para a troca skeleton → tile não gerar layout shift. Se a
// tipografia do SetTile mudar, repita as classes de fonte aqui: as alturas das
// linhas saem delas (`lh`), não de números fixos.
const SetTileSkeleton = () => {
	return (
		<div className='flex h-full flex-col overflow-hidden rounded-card border border-rule bg-panel'>
			<Skeleton className='aspect-4/3 w-full rounded-none' />
			<div className='flex flex-1 flex-col gap-xs p-md'>
				<div className='min-h-[2lh] font-display text-base leading-[1.15] sm:text-md'>
					<Skeleton className='h-4 w-3/4' />
				</div>
				<div className='mt-auto flex flex-col text-base'>
					<div className='flex h-lh items-center'>
						<Skeleton className='h-3 w-1/2' />
					</div>
					<div className='flex h-lh items-center'>
						<Skeleton className='h-3 w-1/3' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default SetTileSkeleton
