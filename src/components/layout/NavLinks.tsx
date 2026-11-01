import { Link } from '@tanstack/react-router'
import { Store, Layers, Heart, User, type LucideIcon } from 'lucide-react'

interface NavItem {
	label: string
	href: string
	icon: LucideIcon
}

const NAV_LINKS: NavItem[] = [
  { label: 'Market', href: '/marketplace', icon: Store },
  { label: 'Colections', href: '/sets', icon: Layers },
  { label: 'Favorites', href: '/favorites', icon: Heart },
  { label: 'Profile', href: '/profile', icon: User },
]

const NavLinks = () => {
	return (
		<nav className='flex items-center gap-4'>
			{NAV_LINKS.map(({ label, href, icon: Icon }) => (
				<Link
					key={href}
					to={href}
					className='flex gap-1 text-sm font-medium text-ink transition-all duration-400'
					activeProps={{ className: 'bg-primary text-ink font-semibold px-3 py-2 rounded-full shadow-[0_0_16px_rgba(139,92,246,0.6)]' }}
				>
					<Icon className='w-4 h-4'/>
					{label}
				</Link>
			))}
		</nav>
	)
}

export default NavLinks
