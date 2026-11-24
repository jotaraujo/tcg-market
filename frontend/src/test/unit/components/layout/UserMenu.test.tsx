import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import UserMenu from '@/components/layout/UserMenu'
import { useAuthStore } from '@/stores/useAuthStore'
import { resetSupabaseMock, supabaseMock } from '@/test/mocks/supabase'

// O UserMenu usa o `useAuth`, que chama o Supabase: o cliente real é trocado
// pelo mock, e o signOut real é exercitado contra ele.
vi.mock('@/lib/supabase', async () => {
	const { supabaseModule } = await import('@/test/mocks/supabase')
	return supabaseModule
})

// Sem RouterProvider no teste, o Link vira um <a> simples com o mesmo href.
vi.mock('@tanstack/react-router', () => ({
	Link: ({ to, ...props }: ComponentProps<'a'> & { to: string }) => (
		<a href={to} {...props} />
	),
}))

// Com o menu aberto, o Radix esconde o resto da página das queries por role;
// por isso o botão é devolvido daqui, capturado antes do clique.
const openMenu = async () => {
	const user = userEvent.setup()
	render(<UserMenu />)
	const trigger = screen.getByRole('button', { name: 'Abrir menu da conta' })
	await user.click(trigger)
	return { user, trigger }
}

describe('UserMenu', () => {
	beforeEach(() => {
		resetSupabaseMock()
		useAuthStore.setState(useAuthStore.getInitialState(), true)
	})

	describe('when logged out', () => {
		beforeEach(() => {
			useAuthStore.getState().setUnauthenticated()
		})

		it('should link "Fazer Login" to /login and "Criar nova conta" to /signup', async () => {
			await openMenu()

			expect(
				screen.getByRole('menuitem', { name: /fazer login/i }),
			).toHaveAttribute('href', '/login')
			expect(
				screen.getByRole('menuitem', { name: /criar nova conta/i }),
			).toHaveAttribute('href', '/signup')
		})

		it('should not show the sign out option', async () => {
			await openMenu()

			expect(
				screen.queryByRole('menuitem', { name: /sair/i }),
			).not.toBeInTheDocument()
		})
	})

	describe('when logged in', () => {
		it('should show the user name and the initials in the avatar', async () => {
			useAuthStore.getState().setAuthenticated({
				id: 'u1',
				email: 'duelista@example.com',
				name: 'Duelista',
			})

			const { trigger } = await openMenu()

			expect(screen.getByText('Duelista')).toBeInTheDocument()
			expect(trigger).toHaveTextContent('DU')
		})

		it('should fall back to the email when the user has no name', async () => {
			useAuthStore.getState().setAuthenticated({
				id: 'u1',
				email: 'duelista@example.com',
				name: null,
			})

			await openMenu()

			expect(screen.getByText('duelista@example.com')).toBeInTheDocument()
		})

		it('should sign out through Supabase when clicking "Sair"', async () => {
			useAuthStore.getState().setAuthenticated({
				id: 'u1',
				email: 'duelista@example.com',
				name: 'Duelista',
			})

			const { user } = await openMenu()
			await user.click(screen.getByRole('menuitem', { name: /sair/i }))

			expect(supabaseMock.auth.signOut).toHaveBeenCalledTimes(1)
		})
	})
})