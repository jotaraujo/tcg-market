import { Search, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import logoImg from '../../assets/logo.png'
import { Button } from '../ui/button'
import MobileMenu from './MobileMenu'
import NavLinks from './NavLinks'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'

// Breakpoint único do header: `lg` (1024px). Em `md` (768px) a nav com texto
// + busca + avatar não cabe (medido: ~920px de conteúdo), então tablet usa o layout mobile.
//   < lg: [logo]                      [lupa] [menu]
//   ≥ lg: [logo TCGMarket] [nav] [busca] [avatar]
const Header = () => {
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const searchTriggerRef = useRef<HTMLButtonElement>(null)
	const searchInputRef = useRef<HTMLInputElement>(null)

	const openSearch = () => {
		// flushSync monta o campo antes do focus(), ainda dentro do clique.
		// O iOS Safari só abre o teclado se o foco acontecer durante o gesto do usuário;
		// um autoFocus num render posterior foca o input, mas não abre o teclado.
		flushSync(() => setIsSearchOpen(true))
		searchInputRef.current?.focus()
	}

	const closeSearch = () => {
		setIsSearchOpen(false)
		// Devolve o foco para a lupa, para quem navega por teclado não "cair" no início da página.
		requestAnimationFrame(() => searchTriggerRef.current?.focus())
	}

	return (
		<header className='sticky top-md z-50 mx-auto mt-md flex w-[calc(100%-2rem)] max-w-256 items-center justify-between gap-sm rounded-pill border border-rule bg-paper-2/70 px-sm py-xs backdrop-blur-[14px] backdrop-saturate-[1.2] lg:gap-lg lg:px-lg'>
			<div className='flex shrink-0 items-center gap-sm'>
				<img src={logoImg} className='size-10' alt='Logo TCGMarket' />
				<span className='whitespace-nowrap border-l border-rule px-3 font-display text-lg font-bold text-ink'>
					TCG Market
				</span>
			</div>

			<div className='hidden lg:block'>
				<NavLinks />
			</div>

			<div className='hidden items-center gap-sm lg:flex'>
				<SearchBar />
				<UserMenu />
			</div>

			{/* Mobile: lupa + menu */}
			<div className='flex items-center gap-2xs lg:hidden'>
				<Button
					ref={searchTriggerRef}
					variant='ghost'
					size='icon'
					aria-label='Abrir busca'
					aria-expanded={isSearchOpen}
					onClick={openSearch}
					className='size-11 rounded-pill text-ink cursor-pointer'
				>
					<Search className='size-5' aria-hidden='true' />
				</Button>
				<MobileMenu />
			</div>

			{/* Mobile: busca expandida cobre a pill inteira enquanto aberta */}
			{isSearchOpen && (
				<div
					className='absolute inset-0 flex items-center gap-2xs rounded-pill bg-paper-2 px-sm lg:hidden'
					onKeyDown={(e) => {
						if (e.key === 'Escape') closeSearch()
					}}
				>
					<SearchBar ref={searchInputRef} className='px-0' />
					<Button
						variant='ghost'
						size='icon'
						aria-label='Fechar busca'
						onClick={closeSearch}
						className='size-11 shrink-0 rounded-pill text-ink cursor-pointer'
					>
						<X className='size-5' aria-hidden='true' />
					</Button>
				</div>
			)}
		</header>
	)
}

export default Header
