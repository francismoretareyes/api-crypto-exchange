import { Request, Response } from 'express';
import assetService from '../services/asset.service';

/**
 * Obtiene todos los criptoactivos disponibles.
 */
const getAllAssets = async (req: Request, res: Response): Promise<void> => {
    try {
        const assets = await assetService.getAllAssets();
        res.status(200).json(assets);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
};

/**
 * Obtiene un criptoactivo en específico.
 */
const getAssetById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const asset = await assetService.getAssetById(id);
        res.status(200).json(asset);
    } catch (error: any) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message || 'Error interno del servidor' });
    }
};

/**
 * Crea un nuevo criptoactivo validando los campos que son obligatorios.
 */
const createAsset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { symbol, name, coincapId } = req.body;

        if (!symbol || !name || !coincapId) {
            res.status(400).json({ error: 'symbol, name y coincapId son campos obligatorios' });
            return;
        }

        const newAsset = await assetService.createAsset(symbol, name, coincapId);
        res.status(201).json({
            message: 'Criptoactivo creado exitosamente',
            asset: newAsset
        });
    } catch (error: any) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message || 'Error interno del servidor' });
    }
};

/**
 * Actualiza el precio del criptoactivo con una llamada a la API de CoinCap.
 */
const refreshAssetPrice = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const updatedAsset = await assetService.refreshAssetPrice(id);

        res.status(200).json({
            message: 'Precio actualizado exitosamente',
            asset: updatedAsset
        });
    } catch (error: any) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message || 'Error interno del servidor' });
    }
};

export default {
    getAllAssets,
    getAssetById,
    createAsset,
    refreshAssetPrice
};
