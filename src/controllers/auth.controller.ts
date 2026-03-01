import { Request, Response } from 'express';
import authService from '../services/auth.service';

/**
 * Función para controlar el registro de un nuevo usuario.
 * Recibe email y password del body, realiza una validación y luego delega la lógica al servicio.
 * @param req - Request que debería contener el email y password en su body.
 * @param res - Response que devolverá un mensaje de éxito junto con el usuario o un mensaje de error.
 */
const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email y password son obligatorios' });
            return;
        }

        const user = await authService.register(email, password);

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: { id: user._id, email: user.email }
        });
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || 'Error interno del servidor';
        res.status(status).json({ error: message });
    }
};

/**
 * Función para controlar el inicio de sesión.
 * Recibe email y password del body y delega su validación al servicio.
 * @param req - Request con email y password en el body.
 * @param res - Response con el token JWT o un mensaje de error.
 */
const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email y password son obligatorios' });
            return;
        }

        const result = await authService.login(email, password);

        res.status(200).json(result);
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || 'Error interno del servidor';
        res.status(status).json({ error: message });
    }
};

export default { register, login };
