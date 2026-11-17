// src/pages/CardDetail.tsx
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { PriceHistorySection } from '@/components/chart/PriceHistorySection'
import { PriceVariationBadge } from '@/components/chart/PriceVariationBadge'
import CardDetailSkeleton from '@/components/cards/CardDetailSkeleton'
import ErrorState from '@/components/ui/ErrorState'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useExchange } from '@/hooks/useExchange'
import { useTCGData } from '@/hooks/useTCGData'
import { getCardStats } from '@/lib/cardStats'
import { getPriceVariation } from '@/lib/priceVariation'
import type { Printing } from '@/types/proxy'

const formatUsd = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
})

const formatBrl = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
})

const formatDay = (iso: string) =>
	new Date(iso).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		timeZone: 'UTC',
	})

const printingKey = (p: Pick<Printing, 'setCode' | 'rarity'>) =>
	`${p.setCode}|${p.rarity}`

const CardDetail = () => {
	const { id } = useParams({ from: '/card/$id' })
	const { setCode, rarity } = useSearch({ from: '/card/$id' })
	const navigate = useNavigate({ from: '/card/$id' })

	const { data, isLoading, isError, isPlaceholderData, refetch, isRefetching } =
		useTCGData(id, { setCode, rarity })
	// Mesma cotação (e o mesmo "≈") que o grid mostra; se falhar, só some a linha em R$
	const { data: rate } = useExchange()

	if (isLoading) return <CardDetailSkeleton />
	if (isError || !data)
		return (
			<ErrorState
				message='Não foi possível carregar os dados da carta.'
				onRetry={() => refetch()}
				isRetrying={isRefetching}
			/>
		)

	const {
		metadata,
		selectedPrinting,
		printings,
		priceHistory,
		priceHistoryStatus,
	} = data
	const hasHistory = priceHistoryStatus === 'ok'
	const latestPrice = hasHistory ? priceHistory.at(-1)?.price : undefined
	// Preço 0 (ou ausente) é "sem preço", como no grid, e não "US$ 0,00"
	const priceUsd = latestPrice ?? (Number(metadata.currentPrice) || null)
	const variation = hasHistory ? getPriceVariation(priceHistory) : null

	const handlePrintingChange = (key: string) => {
		const next = printings.find((p) => printingKey(p) === key)
		if (next)
			navigate({
				search: { setCode: next.setCode, rarity: next.rarity },
				replace: true,
			})
	}

	const tags = [metadata.type, metadata.race, metadata.attribute].filter(
		(tag): tag is string => Boolean(tag),
	)
	const stats = getCardStats(metadata)

	return (
		<div
			className={'mx-auto w-full max-w-288 p-lg fade-in flex flex-col gap-lg'}
		>
			<Link
				to='/marketplace'
				className='inline-flex w-fit items-center gap-xs text-sm text-ink-2 transition-colors duration-(--dur-short) hover:text-ink'
			>
				<ArrowLeft aria-hidden='true' className='size-4' />
				Voltar ao mercado
			</Link>

			<div className='grid grid-cols-1 gap-xl lg:grid-cols-12'>
				<div className='mx-auto w-full max-w-96 lg:sticky lg:top-28 lg:col-span-5 lg:max-w-none lg:self-center'>
					<div className='aspect-421/614 w-full overflow-hidden rounded-card border border-rule bg-panel'>
						<img
							src={metadata.imageUrl}
							alt={metadata.name}
							className='size-full'
							// É a maior imagem da página: carrega já (protege o LCP)
							fetchPriority='high'
							decoding='async'
						/>
					</div>
				</div>

				<div className='flex flex-col gap-xs lg:col-span-7'>
					<header className='flex flex-col gap-sm'>
						{tags.length > 0 && (
							<ul className='flex flex-wrap gap-xs' aria-label='Classificação'>
								{tags.map((tag) => (
									<li
										key={tag}
										className='rounded-pill border border-rule bg-panel px-sm py-2xs text-sm text-ink-2'
									>
										{tag}
									</li>
								))}
							</ul>
						)}
						<h1 className='font-display text-2xl font-semibold text-balance text-ink wrap-anywhere'>
							{metadata.name}
						</h1>
					</header>

					{stats.length > 0 && (
						<dl className='grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-sm'>
							{stats.map(({ label, value }) => (
								<div
									key={label}
									className='flex flex-col rounded-input border border-rule bg-panel px-md py-sm'
								>
									<dt className='text-sm text-ink-2'>{label}</dt>
									<dd className='font-display text-lg font-semibold text-ink'>
										{value}
									</dd>
								</div>
							))}
						</dl>
					)}

					<section
						aria-labelledby='price-label'
						aria-busy={isPlaceholderData}
						className={
							'rounded-card border border-rule bg-panel p-lg flex flex-col gap-md'
						}
					>
						<div className='flex flex-wrap items-end justify-between gap-md'>
							<div className='flex flex-col'>
								<p id='price-label' className='text-sm text-ink-2'>
									{latestPrice !== undefined
										? 'Último preço (Near Mint)'
										: 'Preço (menor entre versões)'}
								</p>
								{priceUsd === null ? (
									<p className='text-2xl text-ink-2'>Sem preço</p>
								) : (
									<>
										<p className='font-outlier text-2xl font-medium text-gold gold-glow-lg'>
											{formatUsd.format(priceUsd)}
										</p>
										{rate !== undefined && (
											<p className='text-sm text-ink-2'>
												≈ {formatBrl.format(priceUsd * rate)}
											</p>
										)}
									</>
								)}
							</div>
							{variation && (
								<div className='flex flex-col items-end gap-2xs'>
									<PriceVariationBadge variation={variation} />
									<span className='text-sm text-ink-2'>no período</span>
								</div>
							)}
						</div>

						{printings.length > 0 && (
							<div className='flex flex-col gap-xs'>
								<label htmlFor='printing' className='text-sm text-ink-2'>
									Impressão
								</label>
								<Select
									value={selectedPrinting ? printingKey(selectedPrinting) : ''}
									onValueChange={handlePrintingChange}
								>
									<SelectTrigger
										id='printing'
										className='flex h-11 w-full cursor-pointer items-center justify-between gap-sm rounded-input border border-rule bg-paper px-sm text-left text-sm text-ink transition-colors duration-(--dur-short) hover:bg-paper-3 focus-visible:outline-2 focus-visible:outline-focus data-[state=open]:bg-paper-3'
									>
										<SelectValue
											placeholder='Escolha uma impressão'
											className='min-w-0 truncate'
										/>
										<ChevronDown
											aria-hidden='true'
											className='size-4 shrink-0 text-ink-2'
										/>
									</SelectTrigger>
									<SelectContent aria-label='Impressões' className='max-w-none'>
										{printings.map((p) => (
											<SelectItem key={printingKey(p)} value={printingKey(p)}>
												{p.setCode} · {p.rarity} ({p.setName})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</section>

					<section
						aria-labelledby='history-title'
						className='rounded-card border border-rule bg-panel p-lg'
					>
						<div className='mb-md flex flex-wrap items-baseline justify-between gap-xs'>
							<h2
								id='history-title'
								className='font-display text-md font-semibold text-ink'
							>
								Histórico de preço
							</h2>
							{hasHistory && priceHistory.length >= 2 && (
								<p className='text-sm text-ink-2'>
									{formatDay(priceHistory[0].date)} –{' '}
									{formatDay(priceHistory[priceHistory.length - 1].date)}
								</p>
							)}
						</div>
						<div
							className={
								isPlaceholderData ? 'opacity-60 transition-opacity' : undefined
							}
						>
							<PriceHistorySection
								status={priceHistoryStatus}
								history={priceHistory}
							/>
						</div>
					</section>
				</div>
			</div>
		</div>
	)
}

export default CardDetail
