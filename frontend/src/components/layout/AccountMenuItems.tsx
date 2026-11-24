import { Link } from '@tanstack/react-router'
import { LogIn, LogOut, UserPlus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '../ui/dropdown-menu'

// Seção "Conta de Duelista" compartilhada entre o UserMenu (desktop) e o
// MobileMenu. Precisa ser renderizada dentro de um DropdownMenuContent.
const AccountMenuItems = () => {
	const { isAuthenticated, user, signOut } = useAuth()

	const handleSignOut = () => {
		// Ainda não há feedback visual para falha ao sair; isto só evita uma
		// promise rejeitada solta.
		signOut().catch((error) => console.error('Falha ao sair', error))
	}

	return (
		<>
			<DropdownMenuLabel className='flex flex-col gap-2xs px-3 py-sm'>
				<span className='text-[0.75rem] font-medium uppercase tracking-widest text-ink-2'>
					Conta de Duelista
				</span>
				<span className='text-base font-medium text-ink'>
					{isAuthenticated
						? (user?.name ?? user?.email)
						: 'Bem-vindo ao TCGMarket'}
				</span>
			</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<DropdownMenuGroup>
				{isAuthenticated ? (
					<DropdownMenuItem
						onClick={handleSignOut}
						className='min-h-10 gap-sm px-3 text-sm text-ink cursor-pointer'
					>
						<LogOut className='size-4 text-ink-2' aria-hidden='true' />
						Sair
					</DropdownMenuItem>
				) : (
					<>
						<DropdownMenuItem
							asChild
							className='min-h-10 gap-sm px-3 text-sm text-ink cursor-pointer'
						>
							{/* @ts-expect-error a rota /login só nasce no T8 */}
							<Link to='/login'>
								<LogIn className='size-4 text-ink-2' aria-hidden='true' />
								Fazer Login
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							asChild
							className='min-h-10 gap-sm px-3 text-sm text-ink cursor-pointer'
						>
							{/* @ts-expect-error a rota /signup só nasce no T6 */}
							<Link to='/signup'>
								<UserPlus className='size-4 text-ink-2' aria-hidden='true' />
								Criar nova conta
							</Link>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuGroup>
		</>
	)
}

export default AccountMenuItems