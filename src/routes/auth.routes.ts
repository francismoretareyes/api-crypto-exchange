import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

// Ruta POST (/auth/register) para registrar un nuevo usuario
router.post('/register', authController.register);

// Ruta POST (/auth/login) para iniciar sesión y generar el token.
router.post('/login', authController.login);

export default router;
