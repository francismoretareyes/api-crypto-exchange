import { Document } from 'mongoose';

/**
 * Interfaz que define la estructura que debe tener una criptomoneda en la base de datos.
 * coincapId es el identificador único de cada criptomoneda que usaremos para consultar sus datos a través de la API de CoinCap.
 * lastPriceUsd y lastPriceAt son opcionales.
 */
export interface IAsset extends Document {
    symbol: string;
    name: string;
    coincapId: string;
    lastPriceUsd?: number;
    lastPriceAt?: Date;
}
