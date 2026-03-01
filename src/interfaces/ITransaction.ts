import { Document, Types } from 'mongoose';

/**
 * Interfaz que define la estructura de una transacción de compra/venta.
 * Se incluye referencias/relaciones a User y Asset para obtener consultas mas rapidas y completas.
 * El campo priceSource para cumplir con el bonus y saber si el precio provino de CoinCap o del caché de la app.
 */
export interface ITransaction extends Document {
    userId: Types.ObjectId;
    assetId: Types.ObjectId;
    type: 'BUY' | 'SELL';
    quantity: number;
    priceUsdAtExecution: number;
    executedAt: Date;
    notes?: string;
    priceSource?: 'COINCAP' | 'CACHE';
}
