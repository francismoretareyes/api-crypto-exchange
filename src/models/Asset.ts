import mongoose, { Schema } from 'mongoose';
import { IAsset } from '../interfaces/IAsset';

/**
 * Schema de los Assets (Criptomonedas).
 * coincapId debe ser único ya que es el identificador para consultas a la API externa de CoinCap.
 * lastPriceUsd y lastPriceAt son opcionales.
 */
const assetSchema = new Schema<IAsset>({
    symbol: {
        type: String,
        required: [true, 'El símbolo es obligatorio'],
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    coincapId: {
        type: String,
        required: [true, 'El coincapId es obligatorio'],
        unique: true,
        trim: true
    },
    lastPriceUsd: {
        type: Number,
        default: null
    },
    lastPriceAt: {
        type: Date,
        default: null
    }
}, {
    versionKey: false
});

export default mongoose.model<IAsset>('Asset', assetSchema);
