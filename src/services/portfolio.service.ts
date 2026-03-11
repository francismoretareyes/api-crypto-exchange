import mongoose from 'mongoose';
import axios from 'axios';
import Transaction from '../models/Transaction';

/**
 * Interfaz de la respuesta del portfolio
 */
export interface IPortfolioItem {
    asset: {
        id: string;
        symbol: string;
        name: string;
        coincapId: string;
    };
    netQuantity: number;
    currentPriceUsd: number;
    currentValueUsd: number;
}

/**
 * Calcula el portfolio de un usuario.
 * Consulta CoinCap para obtener el valor actual en USD.
 */
const getPortfolio = async (userId: string): Promise<IPortfolioItem[]> => {

    const objectId = new mongoose.Types.ObjectId(userId);

    const aggregationResult = await Transaction.aggregate([
        // Filtrar las transacciones de este usuario
        { $match: { userId: objectId } },

        // Agrupar por del assetId
        {
            $group: {
                _id: '$assetId',
                netQuantity: {
                    $sum: {
                        // Si es BUY se suma la cantidad. Si es SELL se resta
                        $cond: [
                            { $eq: ['$type', 'BUY'] },
                            '$quantity',
                            { $multiply: ['$quantity', -1] }
                        ]
                    }
                }
            }
        },

        // Hacer JOIN con la colección de assets para traer lo datos
        {
            $lookup: {
                from: 'assets',
                localField: '_id',
                foreignField: '_id',
                as: 'assetData'
            }
        },

        // Desarmar el array assetData que genera $lookup para que sea un objeto simple
        { $unwind: '$assetData' }
    ]);

    // Filtrar los assets cuya cantidad neta sea mayor que 0
    const activeAssets = aggregationResult.filter(item => item.netQuantity > 0);

    const token = process.env.COINCAP_API_KEY;
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};

    // Mapear cada resultado y buscar el precio actual en CoinCap
    const portfolio: IPortfolioItem[] = await Promise.all(
        activeAssets.map(async (item) => {
            const assetInfo = item.assetData;
            let currentPriceUsd = assetInfo.lastPriceUsd || 0;

            try {
                const response = await axios.get(`https://rest.coincap.io/v3/assets/${assetInfo.coincapId}`, config);
                currentPriceUsd = parseFloat(response.data.data.priceUsd);
            } catch (error: any) {
                console.warn(`[Fallback] No se pudo obtener precio en CoinCap para ${assetInfo.symbol}. Usando precio en caché.`);
            }

            return {
                asset: {
                    id: assetInfo._id,
                    symbol: assetInfo.symbol,
                    name: assetInfo.name,
                    coincapId: assetInfo.coincapId
                },
                netQuantity: item.netQuantity,
                currentPriceUsd,
                currentValueUsd: item.netQuantity * currentPriceUsd
            };
        })
    );

    return portfolio;
};

export default {
    getPortfolio
};
