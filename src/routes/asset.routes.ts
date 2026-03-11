import { Router } from 'express';
import assetController from '../controllers/asset.controller';

const router = Router();

// GET /assets - Obtiene todos los criptoactivos disponibles
router.get('/', assetController.getAllAssets);

// GET /assets/:id - Obtiene un criptoactivo por id
router.get('/:id', assetController.getAssetById);

// POST /assets - Crea un nuevo criptoactivo
router.post('/', assetController.createAsset);

// PATCH /assets/:id/refresh-last-price - Trae cualquier cambio en el precio desde CoinCap
router.patch('/:id/refresh-last-price', assetController.refreshAssetPrice);

export default router;
