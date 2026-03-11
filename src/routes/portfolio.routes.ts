import { Router } from 'express';
import portfolioController from '../controllers/portfolio.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /portfolio - Obtener balance calculado del usuario
router.get('/', portfolioController.getPortfolio);

export default router;
