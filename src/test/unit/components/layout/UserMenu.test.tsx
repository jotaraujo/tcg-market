import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserMenu from '@/components/layout/UserMenu'
import { useAuthStore } from '@/stores/auth'

// ===================================================
// DESCRIÇÃO DO TESTE SUITE
// ===================================================
describe('UserMenu', () => {
	// ---------------------------------------------------
	// BEFORE EACH
	// ---------------------------------------------------
	// Este bloco roda ANTES de cada teste (it) dentro deste describe.
	// É usado para preparar o ambiente de teste:
	//   • Resetar o Zustand store de autenticação para um estado limpo.
	//   • (Opcional) Limpar mocks se necessário.
	beforeEach(() => {
		// Resetar o store de autenticação para garantir independência entre testes
		useAuthStore.setState({ isAuthenticated: false, user: null })
	})

	// ---------------------------------------------------
	// TEST 1: Estado deslogado (Visitante)
	// ---------------------------------------------------
	it('should show options for login when not logged in', async () => {
		const user = userEvent.setup()
		// Renderizar o componente (cria uma instância do UserMenu)
		render(<UserMenu />)

		// • Buscar o botão de trigger do dropdown (único botão na tela).
		// • O trigger é um botão que contém o avatar (User icon quando deslogado).
		const trigger = screen.getByRole('button')
		// • Clicar no trigger para abrir o dropdown menu (Radix UI).
		await user.click(trigger)

		// • Após o clique, o dropdown abre em um portal (fora do DOM do componente).
		// • Buscar o item de menu "Criar nova conta" (Register).
		const registerItem = screen.getByText(/Criar nova conta/i)
		expect(registerItem).toBeInTheDocument()

		// • Buscar o item de menu "Login".
		const loginItem = screen.getByText(/Fazer Login/i)
		expect(loginItem).toBeInTheDocument()
	})

	// ---------------------------------------------------
	// TEST 2: Estado logado (Duelista autenticado)
	// ---------------------------------------------------
	it('should show profile and logout options when logged in', async () => {
		// Configurar estado de autenticado
		useAuthStore.setState({ isAuthenticated: true, user: 'Duelista' })

		const user = userEvent.setup()
		render(<UserMenu />)

		// • Buscar o botão de trigger (único botão na tela).
		const trigger = screen.getByRole('button')
		await user.click(trigger)

		// • Verificar se o nome do usuário aparece
		expect(screen.getByText('Duelista')).toBeInTheDocument()

		// • Buscar o item de menu "Sair" (Logout).
		const logoutItem = screen.getByText(/Sair/i)
		expect(logoutItem).toBeInTheDocument()
	})
})