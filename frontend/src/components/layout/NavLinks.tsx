import { Link } from '@tanstack/react-router'
import { NAV_ITEMS } from './navItems'

const NavLinks = () => {
	return (
		<nav aria-label='Principal' className='flex items-center gap-4'>
			{NAV_ITEMS.map(({ label, href, icon: Icon }) => (
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
