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
  //   • Resetar o Zustand store de autenticaçāo para um estado limpo.
  //   • (Opcional) Limpar mocks se necessário.
  beforeEach(() => {
    // // Resetar o store de autenticaçāo para garantir independência entre testes
    useAuthStore.setState({ isAuthenticated: false, user: null })
  })

  // ---------------------------------------------------
  // TEST 1: Estado deslogado (Visitante)
  // ---------------------------------------------------
  it('should show options for login when not logged in', async () => {
    const user = userEvent.setup()
    // Renderizar o componente (cria uma instância do UserMenu)
    render(<UserMenu />)

    // • Buscar o botão de trigger do dropdown pelo papel semântico.
    // • O trigger é um botão que contém o avatar (User icon quando deslogado).
    const trigger = screen.getByRole('button', { name: /usuário/i })
    // • Clicar no trigger para abrir o dropdown menu (Radix UI).
    await user.click(trigger)

    // • Após o clique, o dropdown abre em um portal (fora do DOM do componente).
    // • Buscar o item de menu "Criar conta" (Register).
    const registerItem = screen.getByText(/Criar conta/i)
    expect(registerItem).toBeInTheDocument()

    // • Buscar o item de menu "Login".
    const loginItem = screen.getByText(/Login/i)
    expect(loginItem).toBeInTheDocument()
  })

  // ---------------------------------------------------
  // TEST 2: Estado logado (Duelista)
  // ---------------------------------------------------
  it('should show profile and logout options when logged in', async () => {
    const user = userEvent.setup()
    // // Configurar o store como logado com um usuário de teste
    useAuthStore.setState({ isAuthenticated: true, user: 'Duelista' })
    render(<UserMenu />)

    // • Buscar o botão de trigger do dropdown.
    // • Quando logado, o avatar mostra as iniciais do usuário ("DU").
    const trigger = screen.getByRole('button', { name: /Duelista/i })
    await user.click(trigger)

    // • Buscar o item de menu "Sair" (Logout).
    const logoutItem = screen.getByText(/Sair/i)
    expect(logoutItem).toBeInTheDocument()
  })
})