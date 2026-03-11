import express from 'express';
import authRoutes from './routes/auth.routes';
import assetRoutes from './routes/asset.routes';

const app = express();
app.disable('x-powered-by');

// Middleware global
app.use(express.json());

// Ruta definida para poder usar register y login.
app.use('/auth', authRoutes);
//Ruta para el CRUD de los assets
app.use('/assets', assetRoutes);

export default app;
