import axios from 'axios';
import Asset from '../models/Asset';
import { IAsset } from '../interfaces/IAsset';

/**
 * Obtiene todos los assets almacenados en la base de datos.
 * @returns Una lista de todos los assets.
 */
const getAllAssets = async (): Promise<IAsset[]> => {
    return await Asset.find();
};

/**
 * Obtiene un asset específico por su ID en la BD.
 * @param id - El ID del asset a buscar.
 * @returns El asset si lo encuentra si no lanza un error.
 */
const getAssetById = async (id: string): Promise<IAsset> => {
    const asset = await Asset.findById(id);
    if (!asset) {
        throw { status: 404, message: 'Criptoactivo no encontrado' };
    }
    return asset;
};

/**
 * Crea un nuevo asset en la base de datos.
 * Verifica que no exista otro asset con el mismo coincapId dentro de la BD.
 * @param symbol - Símbolo del asset
 * @param name - Nombre del asset
 * @param coincapId - ID del asset en CoinCap
 * @returns El asset creado.
 */
const createAsset = async (symbol: string, name: string, coincapId: string): Promise<IAsset> => {

    const normalizedCoincapId = coincapId.trim().toLowerCase();

    const existingAsset = await Asset.findOne({ coincapId: normalizedCoincapId });
    if (existingAsset) {
        throw { status: 409, message: `El activo con coincapId '${normalizedCoincapId}' ya existe` };
    }

    // Crea el nuevo asset en la BD.
    const newAsset = await Asset.create({
        symbol: symbol.trim(),
        name: name.trim(),
        coincapId: normalizedCoincapId
    });

    return newAsset;
};

/**
 * Consulta la API de CoinCap y actualiza el precio de un asset al actual.
 * @param id - El ID del asset que se quiere actualizar.
 * @returns El asset ya actualizado con el nuevo precio y marca de tiempo.
 */
const refreshAssetPrice = async (id: string): Promise<IAsset> => {

    const asset = await getAssetById(id);

    try {
        const token = process.env.COINCAP_API_KEY;

        const config = token ? {
            headers: { 'Authorization': `Bearer ${token}` }
        } : {};

        // Petición a la API de CoinCap v3 con axios
        const response = await axios.get(`https://rest.coincap.io/v3/assets/${asset.coincapId}`, config);

        const priceString = response.data.data.priceUsd;

        const priceUsd = parseFloat(priceString);

        // Actualiza el precio y la fecha de actualización del asset
        asset.lastPriceUsd = priceUsd;
        asset.lastPriceAt = new Date();

        // Guarda el asset ya actualizado en la BD.
        await asset.save();

        return asset;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            throw { status: 404, message: `El asset con coincapId '${asset.coincapId}' no se encontró en la API de CoinCap` };
        }
        console.error('Error al conectar con CoinCap:', error.message);
        throw { status: 502, message: 'Error al obtener el precio desde CoinCap (Bad Gateway)' };
    }
};

export default {
    getAllAssets,
    getAssetById,
    createAsset,
    refreshAssetPrice
};
