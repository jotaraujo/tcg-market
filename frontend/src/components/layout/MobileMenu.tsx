import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Button } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import AccountMenuItems from './AccountMenuItems'
import { MENU_CONTENT_CLASS, MENU_SIDE_OFFSET } from './menuStyles'
import { NAV_ITEMS } from './navItems'

// Menu do header abaixo de `lg`: substitui a nav com texto e o avatar.
// O Radix cuida de foco, Esc, clique fora, setas e aria-expanded.
const MobileMenu = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					aria-label='Abrir menu'
					className='size-11 rounded-pill text-ink cursor-pointer'
				>
					<Menu className='size-5' aria-hidden='true' />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				sideOffset={MENU_SIDE_OFFSET}
				className={MENU_CONTENT_CLASS}
			>
				<nav aria-label='Principal'>
					{NAV_ITEMS.map(({ label, href, icon: Icon }) => (
						<DropdownMenuItem key={href} asChild>
							<Link
								to={href}
								className='min-h-11 gap-sm px-3 text-base text-ink cursor-pointer'
								activeProps={{
									className: 'bg-primary font-semibold text-primary-foreground',
									'aria-current': 'page',
								}}
							>
								<Icon className='size-4' aria-hidden='true' />
								{label}
							</Link>
						</DropdownMenuItem>
					))}
				</nav>

				<DropdownMenuSeparator />

				<AccountMenuItems />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default MobileMenu
