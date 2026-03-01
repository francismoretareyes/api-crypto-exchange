import express from 'express';
import authRoutes from './routes/auth.routes';

const app = express();
app.disable('x-powered-by');

// Middleware global
app.use(express.json());

// Ruta definida para poder usar register y login.
app.use('/auth', authRoutes);

export default app;
