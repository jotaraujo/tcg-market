import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Usa o JSDOM para simular o navegador
    globals: true,  // Habilita variáveis globais como `describe`, `it`, `expect`
    setupFiles: './src/test/setup.ts', // Arquivo de configuração para testes
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})