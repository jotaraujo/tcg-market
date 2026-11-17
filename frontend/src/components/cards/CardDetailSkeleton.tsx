import Skeleton from '../ui/Skeleton'
import {
	CHART_HEIGHT,
	DETAIL_ART_COL,
	DETAIL_ART_FRAME,
	DETAIL_CONTAINER,
	DETAIL_GRID,
	DETAIL_INFO_COL,
	DETAIL_PANEL,
} from './cardDetailLayout'

// Espelha a página de detalhe (CardDetail): link de volta, arte, chips, nome,
// tiles de ATK/DEF/Nível, painel de preço e painel do gráfico. As molduras vêm
// de cardDetailLayout.ts (as mesmas da página); cada linha de texto usa as
// MESMAS classes de fonte do texto real com `h-lh`, então a altura acompanha a
// tipografia em vez de um número fixo.
//
// O que o skeleton não pode saber antes dos dados: quantas linhas tem o nome,
// se a carta tem ATK/DEF/Nível (Spell e Trap não têm) e se há impressões. Ele
// desenha o caso mais comum (monstro, nome de 1 linha, com impressões).
const CardDetailSkeleton = () => {
	return (
		<div
			role='status'
			aria-busy='true'
			className={`${DETAIL_CONTAINER} flex flex-col gap-lg`}
		>
			<span className='sr-only'>Carregando detalhes da carta...</span>

			{/* link "← Voltar ao mercado" */}
			<div className='flex h-lh items-center text-sm'>
				<Skeleton className='h-3 w-36' />
			</div>

			<div className={DETAIL_GRID}>
				<div className={DETAIL_ART_COL}>
					<Skeleton className={`${DETAIL_ART_FRAME} rounded-card`} />
				</div>

				<div className={DETAIL_INFO_COL}>
					<div className='flex flex-col gap-sm'>
						{/* chips de tipo / raça / atributo */}
						<div className='flex gap-xs'>
							<Skeleton className='h-7 w-28 rounded-pill' />
							<Skeleton className='h-7 w-20 rounded-pill' />
							<Skeleton className='h-7 w-16 rounded-pill' />
						</div>
						{/* nome (h1): 1 linha reservada */}
						<div className='flex h-lh items-center font-display text-2xl'>
							<Skeleton className='h-7 w-3/4' />
						</div>
					</div>

					{/* ATK / DEF / Nível */}
					<div className='grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-sm'>
						{[0, 1, 2].map((tile) => (
							<div
								key={tile}
								className='flex flex-col rounded-input border border-rule bg-panel px-md py-sm'
							>
								<div className='flex h-lh items-center text-sm'>
									<Skeleton className='h-3 w-8' />
								</div>
								<div className='flex h-lh items-center font-display text-lg'>
									<Skeleton className='h-4 w-12' />
								</div>
							</div>
						))}
					</div>

					{/* painel de preço */}
					<div className={`${DETAIL_PANEL} flex flex-col gap-md`}>
						<div className='flex flex-wrap items-end justify-between gap-md'>
							<div className='flex flex-col'>
								<div className='flex h-lh items-center text-sm'>
									<Skeleton className='h-3 w-40' />
								</div>
								<div className='flex h-lh items-center font-outlier text-2xl'>
									<Skeleton className='h-8 w-36' />
								</div>
								<div className='flex h-lh items-center text-sm'>
									<Skeleton className='h-3 w-24' />
								</div>
							</div>
							<Skeleton className='h-7 w-20 rounded-pill' />
						</div>
						{/* impressão */}
						<div className='flex flex-col gap-xs'>
							<div className='flex h-lh items-center text-sm'>
								<Skeleton className='h-3 w-20' />
							</div>
							<Skeleton className='h-11 w-full rounded-input' />
						</div>
					</div>

					{/* painel do gráfico */}
					<div className={DETAIL_PANEL}>
						<div className='mb-md flex h-lh items-center font-display text-md'>
							<Skeleton className='h-4 w-44' />
						</div>
						<Skeleton
							className='w-full rounded-input'
							style={{ height: CHART_HEIGHT }}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CardDetailSkeleton
