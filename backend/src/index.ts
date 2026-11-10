import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { proxyService } from './services/proxyService';

// Carrega variáveis de ambiente (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

/**
 * Rota Principal: Detalhes da Carta
 * Busca metadados no YGOPRODECK e histórico de preços na JustTCG.
 */
app.get('/api/tcg/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cardData = await proxyService.getCardFullData(id);
    res.json(cardData);
  } catch (error: any) {
    console.error(`[Server] Error processing request for card ${id}:`, error);

    // Verificação insensível a maiúsculas/minúsculas para "not found"
    if (error.message && error.message.toLowerCase().includes('not found')) {
      return res.status(404).json({
        error: 'Carta não encontrada',
        details: `O ID ${id} não existe no banco de dados do YGOPRODECK.`
      });
    }

    res.status(500).json({
      error: 'Erro interno ao processar dados da carta',
      details: error.message
    });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
  console.log(`Servidor Proxy rodando em http://localhost:${PORT}`);
});
