import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Usa o JSDOM para simular o navegador
    globals: true,  // Habilita variáveis globais como `describe`, `it`, `expect`
  }
})