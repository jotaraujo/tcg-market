import { LogIn, LogOut, UserPlus } from 'lucide-react'
import { useAuthStore } from '#/stores/useAuthStore'
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '../ui/dropdown-menu'

// Mesmo tamanho e respiro para todo item de conta, nos dois menus.
// Foco/hover usa o estilo padrão do item (paper-3): o roxo fica reservado
// para "página ativa", como na nav.
const ITEM_CLASS = 'min-h-10 gap-sm px-3 text-sm text-ink cursor-pointer'
const ICON_CLASS = 'size-4 text-ink-2'

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
					<DropdownMenuItem onClick={logout} className={ITEM_CLASS}>
						<LogOut className={ICON_CLASS} aria-hidden='true' />
						Sair
					</DropdownMenuItem>
				) : (
					<>
						<DropdownMenuItem className={ITEM_CLASS}>
							<LogIn className={ICON_CLASS} aria-hidden='true' />
							Fazer Login
						</DropdownMenuItem>
						<DropdownMenuItem className={ITEM_CLASS}>
							<UserPlus className={ICON_CLASS} aria-hidden='true' />
							Criar nova conta
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuGroup>
		</>
	)
}

export default AccountMenuItems
