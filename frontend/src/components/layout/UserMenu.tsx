import { User } from 'lucide-react'
import { useAuthStore } from '#/stores/useAuthStore'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import AccountMenuItems from './AccountMenuItems'
import { MENU_CONTENT_CLASS, MENU_SIDE_OFFSET } from './menuStyles'

const UserMenu = () => {
	const { isAuthenticated, user } = useAuthStore()

	const initials = user?.slice(0, 2).toUpperCase() ?? '??'

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					aria-label='Abrir menu da conta'
					className='size-11 rounded-pill p-0 hover:bg-transparent cursor-pointer'
				>
					<Avatar className='size-9 border border-primary-hover shadow-glow-brand'>
						<AvatarImage src='' alt='' />
						<AvatarFallback className='bg-transparent text-ink'>
							{isAuthenticated ? initials : <User className='size-4' aria-hidden='true' />}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				sideOffset={MENU_SIDE_OFFSET}
				className={MENU_CONTENT_CLASS}
			>
				<AccountMenuItems />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserMenu
