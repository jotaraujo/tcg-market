import { defineConfig, type Plugin } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// O autoCodeSplitting do router cria chunks por rota que só são descobertos
// depois que o index.js executa (uma cascata: HTML → index.js → chunk da rota).
// Aqui o index.html já os pré-carrega, em paralelo com o index.js, só no build.
const preloadRouteChunks = (chunkNames: string[]): Plugin => ({
	name: 'preload-route-chunks',
	apply: 'build',
	transformIndexHtml: {
		order: 'post',
		handler(_html, ctx) {
			if (!ctx.bundle) return
			return Object.values(ctx.bundle)
				.filter(
					(chunk) => chunk.type === 'chunk' && chunkNames.includes(chunk.name),
				)
				.map((chunk) => ({
					tag: 'link',
					attrs: {
						rel: 'modulepreload',
						crossorigin: true,
						href: `/${chunk.fileName}`,
					},
					injectTo: 'head' as const,
				}))
		},
	},
})

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackRouter({ target: 'react', autoCodeSplitting: true }),
		viteReact(),
		// Chunks que a 1ª tela (/marketplace) sempre precisa.
		preloadRouteChunks(['marketplace', 'useExchange']),
	],
})

export default config
