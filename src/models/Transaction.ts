import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '../interfaces/ITransaction';

/**
 * Schema de las Transacciones.
 * Representa una operación de compra/venta (BUY/SELL) de una criptomoneda.
 * priceUsdAtExecution se mantiene fijo desde el momento en que se efectúa la transacción.
 */
const transactionSchema = new Schema<ITransaction>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El userId es obligatorio']
    },
    assetId: {
        type: Schema.Types.ObjectId,
        ref: 'Asset',
        required: [true, 'El assetId es obligatorio']
    },
    type: {
        type: String,
        enum: {
            values: ['BUY', 'SELL'],
            message: 'El tipo debe ser BUY o SELL'
        },
        required: [true, 'El tipo de transacción es obligatorio']
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        min: [0.00000001, 'La cantidad debe ser mayor a 0']
    },
    priceUsdAtExecution: {
        type: Number,
        required: [true, 'El precio de ejecución es obligatorio']
    },
    executedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true,
        default: null
    },
    priceSource: {
        type: String,
        enum: {
            values: ['COINCAP', 'CACHE'],
            message: 'El priceSource debe ser COINCAP o CACHE'
        },
        default: null
    }
}, {
    versionKey: false
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
