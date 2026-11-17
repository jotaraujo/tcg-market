// Classes compartilhadas entre a página de detalhe e o skeleton dela. Ficam num
// lugar só para os dois nunca divergirem: se a moldura mudar aqui, o skeleton
// acompanha e a troca skeleton → conteúdo continua sem layout shift.

export const DETAIL_CONTAINER = 'mx-auto w-full max-w-288 p-lg'

// Split Studio: arte (5 colunas) + dados (7) no desktop; empilha no mobile.
export const DETAIL_GRID = 'grid grid-cols-1 gap-xl lg:grid-cols-12'

// No desktop a arte fica centralizada na vertical em relação à coluna de dados
// e, se os painéis forem mais altos que a tela, acompanha a rolagem (sticky).
export const DETAIL_ART_COL =
	'mx-auto w-full max-w-96 lg:sticky lg:top-28 lg:col-span-5 lg:max-w-none lg:self-center'

// Proporção real das artes da YGOPRODECK (421×614): sem corte e sem CLS.
export const DETAIL_ART_FRAME =
	'aspect-[421/614] w-full overflow-hidden rounded-card border border-rule bg-panel'

export const DETAIL_INFO_COL = 'flex flex-col gap-lg lg:col-span-7'

export const DETAIL_PANEL = 'rounded-card border border-rule bg-panel p-lg'

// Altura do gráfico (px): o skeleton reserva exatamente este espaço.
export const CHART_HEIGHT = 300
