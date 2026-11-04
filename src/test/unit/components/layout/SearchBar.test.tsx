import { render, screen, fireEvent, act } from '@testing-library/react'
import { useSearchTermStore } from '@/stores/SearchTerm'
import SearchBar from '@/components/layout/SearchBar'

describe('SearchBar', () => {
  // ---------------------------------------------------
  // BEFORE EACH
  // ---------------------------------------------------
  // Este bloco roda ANTES de cada teste (it) dentro deste describe.
  // É usado para preparar o ambiente de teste:
  //   • Resetar o Zustand store para um estado limpo.
  //   • Iniciar temporizadores falsos (fake timers) — essenciais para testar debounces.
  beforeEach(() => {
    // // Resetar o store para garantir independência entre testes
    useSearchTermStore.setState({ term: '' })
    // // Usar temporizadores falsos do Vitest para controlar o tempo dentro de tests
    vi.useFakeTimers()
  })

  // ---------------------------------------------------
  // AFTER EACH
  // ---------------------------------------------------
  // Este bloco roda DEPOIS de cada teste (it) dentro deste describe.
  // É usado para limpar efeitos colaterais dos testes:
  //   • Restaurar temporizadores reais (para não afetar outras partes da aplicação).
  //   • Limpar mocks se necessário (vi.clearAllMocks() poderia ser aqui).
  afterEach(() => {
    // // Desfazer o fake timer e voltar ao tempo real
    vi.useRealTimers()
  })

  it('updates the search store with debounce of 300ms', () => {
    render(<SearchBar />)

    // Encontrar o campo de input pela legenda placeholder
    const input = screen.getByPlaceholderText(/Buscar cartas/i)
    // Disparar um evento de change (simular digitação)
    fireEvent.change(input, { target: { value: 'Blue-Eyes' } })

    // • ANTES do debounce (300ms) o store ainda deve estar vazio.
    // • Isso garante que o debouncing está funcionando: não atualizamos o store imediatamente.
    expect(useSearchTermStore.getState().term).toBe('')

    // • Avança os temporizadores falsos exatamente em 300ms (o tempo do debounce).
    // • `act()` garante que re-renderizações React após o timer sejam processadas.
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Após o debounce, o store deve ter o novo termo
    expect(useSearchTermStore.getState().term).toBe('Blue-Eyes')
  })
})    