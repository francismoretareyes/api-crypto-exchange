import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Interfaz para extender el Request de Express con el userId.
 * Así podemos acceder a req.userId en cualquier controlador protegido.
 */
export interface AuthRequest extends Request {
    userId?: string;
}

/**
 * Middleware de autenticación JWT.
 * Verifica que el token enviado en el header Authorization sea válido.
 * Extrae el userId del token y lo inyecta en req.userId.
 * REGLA INQUEBRANTABLE: el userId SIEMPRE se obtiene del token, NUNCA del body.
 * @param req - Request de Express ya extendido con userId
 * @param res - Response de Express
 * @param next - Función para continuar con el siguiente middleware o controlador
 */
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        // Extrae el token enviado en el header Authorization de tipo Bearer
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Token de autenticación no proporcionado' });
            return;
        }

        // Extrae únicamente el token, quitando el prefijo de Bearer
        const token = authHeader.split(' ')[1];

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ error: 'JWT_SECRET no está configurado' });
            return;
        }

        // Verifica y decodifica el token
        const decoded = jwt.verify(token, secret) as { userId: string };

        // Inyecta el userId ya verificado en la request para que los controladores lo utilicen de manera segura
        req.userId = decoded.userId;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

export default authMiddleware;
