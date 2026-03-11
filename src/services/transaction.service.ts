import axios from 'axios';
import Transaction from '../models/Transaction';
import Asset from '../models/Asset';
import { ITransaction } from '../interfaces/ITransaction';

/**
 * Interfaz para definir las opciones de paginación
 */
export interface PaginationOptions {
    page: number;
    limit: number;
}

/**
 * Interfaz para definir la respuesta paginada
 */
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}

/**
 * Crea una nueva transacción.
 */
const createTransaction = async (userId: string, assetId: string, type: 'BUY' | 'SELL', quantity: number, notes?: string): Promise<ITransaction> => {
    const asset = await Asset.findById(assetId);
    if (!asset) {
        throw { status: 404, message: 'El asset especificado no existe' };
    }

    let currentPriceUsd: number;
    let priceSource: 'COINCAP' | 'CACHE' = 'COINCAP';

    try {
        // Obtener precio actual desde CoinCap usando el coincapId del Asset
        const token = process.env.COINCAP_API_KEY;
        const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};

        const response = await axios.get(`https://rest.coincap.io/v3/assets/${asset.coincapId}`, config);
        currentPriceUsd = parseFloat(response.data.data.priceUsd);
    } catch (error) {
        // Si CoinCap falla usa el último precio guardado en el Asset
        if (asset.lastPriceUsd) {
            currentPriceUsd = asset.lastPriceUsd;
            priceSource = 'CACHE';
            console.warn(`[Fallback] CoinCap falló. Usando lastPriceUsd para ${asset.symbol}`);
        } else {
            console.error('Error al conectar con CoinCap para precio de la transacción');
            throw { status: 503, message: 'Servicio de CoinCap no disponible y no hay precio en caché' };
        }
    }

    // Crear y guardar la transacción en la BD
    const transaction = await Transaction.create({
        userId,
        assetId,
        type,
        quantity,
        priceUsdAtExecution: currentPriceUsd,
        notes,
        priceSource,
        executedAt: new Date()
    });

    return transaction;
};

/**
 * Obtiene todas las transacciones de un usuario con paginación.
 */
const getUserTransactions = async (userId: string, options: PaginationOptions): Promise<PaginatedResult<ITransaction>> => {
    const page = Math.max(1, options.page);
    const limit = Math.max(1, options.limit);
    const skip = (page - 1) * limit;

    // Consulta transacciones y total de transacciones
    const [data, total] = await Promise.all([
        Transaction.find({ userId })
            .populate('assetId', 'symbol name coincapId') // Datos del Asset
            .sort({ executedAt: -1 }) // Ordena por fecha descendente para que las recientes salen primero
            .skip(skip)
            .limit(limit),
        Transaction.countDocuments({ userId })
    ]);

    return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

/**
 * Obtiene una transacción específica.
 */
const getTransactionById = async (id: string, userId: string): Promise<ITransaction> => {
    const transaction = await Transaction.findOne({ _id: id, userId })
        .populate('assetId', 'symbol name coincapId');

    if (!transaction) {
        throw { status: 404, message: 'Transacción no encontrada o no pertenece al usuario' };
    }

    return transaction;
};

/**
 * Actualiza una transacción.
 */
const updateTransaction = async (id: string, userId: string, updateData: { notes?: string, executedAt?: Date }): Promise<ITransaction> => {
    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
        throw { status: 404, message: 'Transacción no encontrada o no pertenece al usuario' };
    }

    // Actualizamos solo los campos permitidos si vienen en el parámetro updateData
    if (updateData.notes !== undefined) {
        transaction.notes = updateData.notes;
    }

    if (updateData.executedAt !== undefined) {
        transaction.executedAt = updateData.executedAt;
    }

    await transaction.save();

    return transaction;
};

/**
 * Elimina una transacción.
 */
const deleteTransaction = async (id: string, userId: string): Promise<void> => {
    const result = await Transaction.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
        throw { status: 404, message: 'Transacción no encontrada o no pertenece al usuario' };
    }
};

export default {
    createTransaction,
    getUserTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};
