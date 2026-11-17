import '@testing-library/jest-dom/vitest'
import { server } from './mocks/server'

// O jsdom não implementa estas APIs de DOM que o Select do Radix usa para abrir
// a lista e rolar até a opção marcada.
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.setPointerCapture ??= () => {}
Element.prototype.releasePointerCapture ??= () => {}
Element.prototype.scrollIntoView ??= () => {}

// O cmdk (busca das coleções) observa o tamanho da lista com ResizeObserver.
globalThis.ResizeObserver ??= class {
	observe() {}
	unobserve() {}
	disconnect() {}
}

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
