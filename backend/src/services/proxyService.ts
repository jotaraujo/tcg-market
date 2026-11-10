import { UnifiedCardResponse } from '../types/proxy';
import { ygoprodeckService } from './ygoprodeckService';
import { justTcgService } from './justTcgService';
import { JustTCG_PriceEntry } from '../types/api';

/**
 * Serviço Orquestrador (Proxy Service).
 * Responsável por coordenar as chamadas entre YGOPRODECK e JustTCG.
 */
export const proxyService = {
  /**
   * Orquestra a busca completa de uma carta: metadados + histórico.
   * @param cardId ID numérico da carta
   */
  async getCardFullData(cardId: string): Promise<UnifiedCardResponse> {
    // 1. Buscar metadados (Obrigatório)
    // Se falhar aqui, a requisição inteira falha (404 ou 500)
    const rawCard = await ygoprodeckService.fetchCardMetadata(cardId);

    // 2. Tentar buscar histórico de preços (Opcional)
    // Tipamos explicitamente como JustTCG_PriceEntry[] para evitar o erro de 'any[]'
    let priceHistory: JustTCG_PriceEntry[] = [];

    try {
      // Em modo mock, usar o ID da carta diretamente como chave
      // Em produção, isso seria o slug gerado do YGOPRODECK
      priceHistory = await justTcgService.fetchPriceHistory(cardId);
    } catch (error) {
      console.error(`[Proxy Service] Price history unavailable for card ${cardId}:`, error);
    }

    // 3. Unificar os dados no contrato do Frontend (UnifiedCardResponse)
    return {
      metadata: {
        id: rawCard.id.toString(),
        name: rawCard.name,
        type: rawCard.type,
        race: rawCard.race,
        attribute: rawCard.attribute,
        level: rawCard.level,
        atk: rawCard.atk,
        def: rawCard.def,
        imageUrl: rawCard.card_images[0]?.image_url || '',
        currentPrice: rawCard.card_prices?.[0]?.tcgplayer_price ?? '',
      },
      priceHistory,
      source: 'proxy-v1'
    };
  }
};
