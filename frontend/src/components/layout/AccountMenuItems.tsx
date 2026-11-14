import { LogIn, LogOut, UserPlus } from 'lucide-react'
import { useAuthStore } from '#/stores/useAuthStore'
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '../ui/dropdown-menu'

// Seção "Conta de Duelista" compartilhada entre o UserMenu (desktop) e o
// MobileMenu. Precisa ser renderizada dentro de um DropdownMenuContent.
const AccountMenuItems = () => {
	const { isAuthenticated, user, logout } = useAuthStore()

	return (
		<>
			<DropdownMenuLabel className='flex flex-col gap-2xs px-3 py-sm'>
				<span className='text-[0.75rem] font-medium uppercase tracking-widest text-ink-2'>
					Conta de Duelista
				</span>
				<span className='text-base font-medium text-ink'>
					{isAuthenticated ? user : 'Bem-vindo ao TCGMarket'}
				</span>
			</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<DropdownMenuGroup>
				{isAuthenticated ? (
					<DropdownMenuItem onClick={logout} className='min-h-10 gap-sm px-3 text-sm text-ink cursor-pointer'>
						<LogOut className='size-4 text-ink-2' aria-hidden='true' />
						Sair
					</DropdownMenuItem>
				) : (
					<>
						<DropdownMenuItem className='min-h-10 gap-sm px-3 text-sm text-ink cursor-pointer'>
							<LogIn className='size-4 text-ink-2' aria-hidden='true' />
							Fazer Login
						</DropdownMenuItem>
						<DropdownMenuItem className='min-h-10 gap-sm px-3 text-sm text-ink cursor-pointer'>
							<UserPlus className='size-4 text-ink-2' aria-hidden='true' />
							Criar nova conta
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuGroup>
		</>
	)
}

export default AccountMenuItems
