import { useEffect, useRef, useState } from 'react'
import CardGrid from '@/components/cards/CardGrid'
import SetCombobox from '@/components/sets/SetCombobox'
import SetHeader from '@/components/sets/SetHeader'
import SetTile from '@/components/sets/SetTile'
import YearSelect from '@/components/sets/YearSelect'
import ErrorState from '@/components/ui/ErrorState'
import Skeleton from '@/components/ui/Skeleton'
import { useSets } from '@/hooks/useSets'
import {
	findSetByName,
	getRecentSets,
	getSearchableSets,
	getSetsByYear,
	getSetYears,
} from '@/lib/sets'

interface SetsPageProps {
	// Nome da coleção escolhida (vem da URL: /sets?set=<nome>)
	selectedName?: string
	onSelectSet: (name?: string) => void
}

const TILES_GRID_CLASSES =
	'grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

const SKELETON_COUNT = 12

const SetsPage = ({ selectedName, onSelectSet }: SetsPageProps) => {
	const { data: sets, isLoading, isError, refetch, isFetching } = useSets()
	// O ano dos chips é estado da página: continua marcado ao voltar de uma coleção
	const [year, setYear] = useState<number | undefined>()

	// O app rola dentro do <main> do layout (não na janela), então abrir ou
	// fechar uma coleção manteria o scroll do modo anterior: quem escolhe um tile
	// lá embaixo cairia no meio do grid. Voltar ao topo a cada troca resolve.
	const sectionRef = useRef<HTMLElement>(null)
	useEffect(() => {
		sectionRef.current?.closest('main')?.scrollTo({ top: 0 })
	}, [selectedName])

	const today = new Date()

	const renderBody = () => {
		if (isLoading) {
			return (
				<div
					className={TILES_GRID_CLASSES}
					aria-busy='true'
					aria-label='Carregando coleções'
				>
					{Array.from({ length: SKELETON_COUNT }).map((_, index) => (
						<Skeleton key={index} className='aspect-square w-full' />
					))}
				</div>
			)
		}

		if (isError || !sets) {
			return (
				<ErrorState
					message='Não foi possível carregar as coleções.'
					onRetry={() => refetch()}
					isRetrying={isFetching}
				/>
			)
		}

		const selected = selectedName
			? findSetByName(sets, selectedName)
			: undefined
		const searchable = getSearchableSets(sets, today)
		// Os chips também refinam a busca, mas só enquanto nenhuma coleção está aberta
		const comboboxSets =
			!selectedName && year !== undefined
				? getSetsByYear(sets, year, today)
				: searchable

		const combobox = (
			<SetCombobox
				sets={comboboxSets}
				value={selected}
				onSelect={onSelectSet}
			/>
		)

		if (selectedName && !selected) {
			return (
				<>
					{combobox}
					<div className='flex flex-col items-center gap-sm p-xl text-center'>
						<p className='text-base font-medium text-ink'>
							Coleção não encontrada
						</p>
						<p className='text-sm text-ink-2'>
							Não existe uma coleção chamada “{selectedName}”.
						</p>
						<button
							type='button'
							onClick={() => onSelectSet(undefined)}
							className='inline-flex h-10 cursor-pointer items-center rounded-pill border border-rule bg-paper-2 px-md text-sm text-ink transition-colors duration-(--dur-short) hover:bg-paper-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'
						>
							Ver coleções
						</button>
					</div>
				</>
			)
		}

		if (selected) {
			return (
				<>
					{combobox}
					<SetHeader set={selected} onClear={() => onSelectSet(undefined)} />
					<div className='flex flex-1 min-h-0 overflow-hidden'>
						<CardGrid filters={{ cardset: selected.set_name }} />
					</div>
				</>
			)
		}

		const tiles =
			year === undefined
				? getRecentSets(sets, today)
				: getSetsByYear(sets, year, today)
		const title =
			year === undefined ? 'Lançamentos recentes' : `Coleções de ${year}`

		return (
			<>
				<div className='flex flex-wrap items-center gap-sm'>
					{combobox}
					<YearSelect
						years={getSetYears(sets, today)}
						selected={year}
						onChange={setYear}
					/>
				</div>
				<h2 className='font-display text-xl font-semibold text-ink'>{title}</h2>
				<ul aria-label={title} className={TILES_GRID_CLASSES}>
					{tiles.map((set) => (
						<li key={set.set_name}>
							<SetTile set={set} onSelect={onSelectSet} />
						</li>
					))}
				</ul>
			</>
		)
	}

	return (
		<section ref={sectionRef} className='flex flex-col gap-lg w-full p-lg'>
			<h1 className='font-display text-2xl font-semibold tracking-tight text-ink'>
				Coleções
			</h1>
			{renderBody()}
		</section>
	)
}

export default SetsPage
