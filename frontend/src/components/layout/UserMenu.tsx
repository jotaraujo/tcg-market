import { LogIn, UserPlus, LogOut, User } from 'lucide-react'
import { useAuthStore } from '#/stores/useAuthStore'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const UserMenu = () => {
	const { isAuthenticated, user, logout } = useAuthStore()

	const initials = user?.slice(0, 2).toUpperCase() ?? '??'

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className='bg-transparent hover:bg-transparent cursor-pointer'>
					<Avatar className='h-9 w-9 bg-transparent border border-primary-hover'>
						<AvatarImage src='' alt={user ?? 'Usuário'} />
						<AvatarFallback className='bg-transparent shadow-[0_0_16px_rgba(139,92,246,0.6)]'>
							{isAuthenticated ? initials : <User className='h-4 w-4' />}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align='end' className='bg-accent/80 border border-muted w-64 mt-2 p-1'>
				<DropdownMenuLabel className='flex flex-col gap-0.5 px-3 py-2'>
					<span className='text-[10px] font-semibold tracking-widest text-text-muted uppercase'>
						Conta de Duelista
					</span>
					<span className='text-sm font-medium text-text-foreground'>
						{isAuthenticated ? user : 'Bem-vindo ao TCGMarket'}
					</span>
				</DropdownMenuLabel>

				<DropdownMenuSeparator/>

				{isAuthenticated ? (
					<DropdownMenuItem
						onClick={logout}
						className='focus:border-accent rounded-md transition-colors duration-300 cursor-pointer'
					>
						<LogOut className='mr-2 h-4 w-4' />
						Sair
					</DropdownMenuItem>
				) : (
					<div className='flex flex-col gap-2'>
						<DropdownMenuItem className='focus:bg-primary rounded-md py-2 px-3 transition-all duration-300 cursor-pointer'>
							<LogIn className='h-4 w-4' />
							Fazer Login
						</DropdownMenuItem>
						<DropdownMenuItem className='focus:bg-primary rounded-md py-2 px-3 transition-all duration-300 cursor-pointer'>
							<UserPlus className='h-4 w-4' />
							Criar nova conta
						</DropdownMenuItem>
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserMenu
