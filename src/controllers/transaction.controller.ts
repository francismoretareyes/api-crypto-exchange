import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import transactionService from '../services/transaction.service';

/**
 * Crear una nueva transacción de Compra/Venta
 */
const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId as string;
        const { assetId, type, quantity, notes } = req.body;

        if (!assetId || !type || quantity === undefined) {
            res.status(400).json({ error: 'assetId, type y quantity son obligatorios' });
            return;
        }

        if (type !== 'BUY' && type !== 'SELL') {
            res.status(400).json({ error: 'El type solo puede ser BUY o SELL' });
            return;
        }

        if (quantity <= 0) {
            res.status(400).json({ error: 'quantity debe ser mayor a 0' });
            return;
        }

        const transaction = await transactionService.createTransaction(userId, assetId, type, quantity, notes);
        res.status(201).json({
            message: 'Transacción creada exitosamente',
            transaction
        });
    } catch (error: any) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message || 'Error interno del servidor' });
    }
};

/**
 * Obtener transacciones del usuario
 */
const getUserTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId as string;

        // Paginación por Query Params
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await transactionService.getUserTransactions(userId, { page, limit });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
};

/**
 * Obtener una transacción específica del usuario
 */
const getTransactionById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId as string;
        const id = req.params.id as string;

        const transaction = await transactionService.getTransactionById(id, userId);
        res.status(200).json(transaction);
    } catch (error: any) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message || 'Error interno del servidor' });
    }
};

/**
 * Actualizar una transacción con límites
 */
const updateTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId as string;
        const id = req.params.id as string;
        const { notes, executedAt, type, quantity, assetId, priceUsdAtExecution } = req.body;

        if (type || quantity !== undefined || assetId || priceUsdAtExecution !== undefined) {
            res.status(403).json({ error: 'Operación denegada: Solo está permitido actualizar notes y executedAt mediante PATCH' });
            return;
        }

        const updateData: { notes?: string, executedAt?: Date } = {};

        if (notes !== undefined) updateData.notes = notes;
        if (executedAt !== undefined) updateData.executedAt = new Date(executedAt);

        const transaction = await transactionService.updateTransaction(id, userId, updateData);
        res.status(200).json({
            message: 'Transacción actualizada exitosamente',
            transaction
        });
    } catch (error: any) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message || 'Error interno del servidor' });
    }
};

/**
 * Eliminar una transacción del usuario
 */
const deleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId as string;
        const id = req.params.id as string;

        await transactionService.deleteTransaction(id, userId);
        res.status(200).json({ message: 'Transacción eliminada exitosamente' });
    } catch (error: any) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message || 'Error interno del servidor' });
    }
};

export default {
    createTransaction,
    getUserTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};
