import express from 'express';
import authRoutes from './routes/auth.routes';
import assetRoutes from './routes/asset.routes';
import transactionRoutes from './routes/transaction.routes';
import portfolioRoutes from './routes/portfolio.routes';

const app = express();
app.disable('x-powered-by');

// Middleware global
app.use(express.json());

// Ruta definida para poder usar register y login.
app.use('/auth', authRoutes);
//Ruta para el CRUD de los assets
app.use('/assets', assetRoutes);
//Ruta para el CRUD de transactions
app.use('/transactions', transactionRoutes);
//Ruta para el CRUD de portfolio
app.use('/portfolio', portfolioRoutes);

export default app;
