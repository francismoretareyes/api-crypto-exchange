import { Router } from 'express';
import transactionController from '../controllers/transaction.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Auth para todas las rutas
router.use(authMiddleware);

// POST /transactions - Crear compra o venta
router.post('/', transactionController.createTransaction);

// GET /transactions - Obtener todas las transacciones paginadas del usuario
router.get('/', transactionController.getUserTransactions);

// GET /transactions/:id - Obtener una transacción específica del usuario
router.get('/:id', transactionController.getTransactionById);

// PATCH /transactions/:id - Actualizar notas y fecha
router.patch('/:id', transactionController.updateTransaction);

// DELETE /transactions/:id - Eliminar transacción
router.delete('/:id', transactionController.deleteTransaction);

export default router;
