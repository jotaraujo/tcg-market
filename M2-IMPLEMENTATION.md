# M2: Implementação do Detalhe da Carta com Gráfico de 7 Dias

## Resumo das Mudanças

Implementação completa do M2 (Card Detail Page com histórico de preços) conectando frontend ao backend proxy que orquestra YGOPRODECK + JustTCG.

---

## Arquitetura

```
Frontend (localhost:3002)
    ↓
CardGrid → clica em carta → NavLink para /card/$id
    ↓
CardDetail.tsx (useParams({ from: '/card/$id' }))
    ↓
useTCGData(cardId) → fetchCardFullData()
    ↓
Backend Proxy (localhost:3001/api/tcg/:id)
    ↓
├─ ygoprodeckService.fetchCardMetadata() → https://db.ygoprodeck.com/api/v7/cardinfo.php
└─ justTcgService.fetchPriceHistory() → https://api.justtcg.com/v2/cards/{slug}/prices
    ↓
UnifiedCardResponse { metadata, priceHistory, source }
    ↓
PriceHistoryChart (Recharts LineChart)
```

---

## Arquivos Criados

### 1. **backend/src/index.ts**
Express server configurado com CORS, dotenv, JSON parsing. Rota principal `/api/tcg/:id`.

### 2. **backend/src/services/ygoprodeckService.ts**
Busca metadados da carta na YGOPRODECK v7. URL corrigida para `/api/v7/cardinfo.php`.

### 3. **backend/src/services/justTcgService.ts**
Busca histórico de preços na JustTCG. Gera slug para queries.

### 4. **backend/src/services/proxyService.ts**
Orquestra ambas APIs e retorna `UnifiedCardResponse`.

### 5. **backend/src/types/api.ts**
Interfaces brutas para YGOPRODECK v7 e JustTCG v2 com SSOT pattern.

### 6. **backend/src/types/proxy.ts**
Contrato unificado: `UnifiedCardMetadata`, `PriceHistoryEntry`, `UnifiedCardResponse`.

### 7. **frontend/src/types/proxy.ts**
Espelho do contrato backend no frontend.

### 8. **frontend/src/hooks/useTCGData.ts**
Hook único com TanStack Query. queryKey: `['tcg', cardId]`. Cache 1 dia.

### 9. **frontend/src/lib/api/proxy.ts**
Camada SEAM. Função `fetchCardFullData(cardId)` chamando proxy.

### 10. **frontend/src/components/chart/PriceHistoryChart.tsx**
Recharts LineChart com histórico formatado em USD.

---

## Arquivos Modificados

### Frontend
- **CardDetail.tsx**: Refatorada para usar `useTCGData` + `PriceHistoryChart`
- **SearchBar.tsx**: Corrigido import path e type handler
- **ygoprodeck.ts**: Removido `fetchCardById` (antes estava aqui)

### Backend
- **ygoprodeckService.ts**: Removidos mocks, agora só API real
- **justTcgService.ts**: Removidos mocks, agora só API real
- **.env**: `USE_MOCKS=false`

### Monorepo
- **vitest.config.ts**: Movido para frontend/, jsdom + globals ativados
- **.gitignore**: Atualizado para estrutura frontend/backend

---

## Fluxo Completo

1. Usuário clica em carta no Marketplace
2. NavLink navega para `/card/123`
3. CardDetail monta, extrai `id=123` via `useParams({ from: '/card/$id' })`
4. `useTCGData("123")` faz fetch para `http://localhost:3001/api/tcg/123`
5. Backend proxy chama YGOPRODECK + JustTCG em paralelo
6. Retorna `UnifiedCardResponse`
7. CardDetail renderiza imagem, nome, ATK, DEF, tipo, raça, preço
8. `PriceHistoryChart` renderiza gráfico com 7 dias

---

## Decisões Técnicas

### Por que um hook único (`useTCGData`)?
- Uma requisição HTTP (proxy orquestra tudo)
- Cache centralizado
- Falha graceful: se JustTCG falhar, metadados render mesmo assim

### Por que backend proxy?
- Resolve mismatch de IDs: YGOPRODECK (numérico) vs JustTCG (slug)
- Centraliza lógica de orquestração
- Facilita trocar fonte (ex: Supabase Phase 2)

### Por que `from: '/card/$id'`?
- Type-safe `useParams`
- Sem isso, `id` era `undefined` → sempre cache de mock 123

---

## Próximos Passos

- **M3**: Tratamento de erro/vazio específicos
- **M4**: Lazy loading, code-splitting, Lighthouse audit
- **M5**: Deploy + README com métricas
- **Phase 2**: Snapshots Supabase, histórico ilimitado

---

## Como Usar

### Desenvolvimento
```bash
# Backend
cd backend && npm run dev

# Frontend (outra aba)
cd frontend && npm run dev
```

### Produção (APIs reais)
```bash
# backend/.env
USE_MOCKS=false

# Reiniciar backend
npm run dev
```