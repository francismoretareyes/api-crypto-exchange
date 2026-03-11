import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import portfolioService from '../services/portfolio.service';

/**
 * Obtener el portfolio del usuario
 */
const getPortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId as string;

        const portfolio = await portfolioService.getPortfolio(userId);

        res.status(200).json(portfolio);
    } catch (error: any) {
        console.error('Error calculando el portfolio:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al calcular el portfolio' });
    }
};

export default {
    getPortfolio
};
