import { Link } from '@tanstack/react-router'
import { Store, Layers, ArrowLeftRight, User, type LucideIcon } from 'lucide-react'

interface NavItem {
	label: string
	href: string
	icon: LucideIcon
}

const NAV_LINKS: NavItem[] = [
  { label: 'Market', href: '/marketplace', icon: Store },
  { label: 'Colections', href: '/sets', icon: Layers },
  { label: 'Favorites', href: '/favorites', icon: ArrowLeftRight },
  { label: 'Profile', href: '/profile', icon: User },
]

const NavLinks = () => {
	return (
		<nav className='flex items-center gap-4'>
			{NAV_LINKS.map(({ label, href, icon: Icon }) => (
				<Link
					key={href}
					to={href}
					className='text-sm font-medium text-ink transition-all duration-500'
					activeProps={{ className: 'bg-accent text-ink font-semibold py-2 px-4 rounded-full' }}
				>
					<Icon className='w-4 h-4'/>
					{label}
				</Link>
			))}
		</nav>
	)
}

export default NavLinks
