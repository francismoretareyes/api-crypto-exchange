import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../interfaces/IUser';

/**
 * Registra un nuevo usuario en la base de datos.
 * Hashea la contraseña irreversiblemente antes de que se guarde para que nunca se almacene en texto común.
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns El usuario creado (documento completo)
 */
const register = async (email: string, password: string): Promise<IUser> => {
    // Normaliza el email antes de buscar para evitar duplicados
    const normalizedEmail = email.trim().toLowerCase();

    // Verifica si existe un usuario con el mismo email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw { status: 409, message: 'Ya existe un usuario con ese email' };
    }

    // Hashea la contraseña con bcrypt.hash()
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea y guarda el usuario en la base de datos
    const user = await User.create({ email: normalizedEmail, password: hashedPassword });

    return user;
};

/**
 * Autentifica al usuario y le genera un token JWT.
 * Compara la contraseña proporcionada por el usuario con el hash almacenado en la base de datos.
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns Un objeto con el token JWT generado
 */
const login = async (email: string, password: string): Promise<{ token: string }> => {
    // Normaliza el email antes de buscar
    const normalizedEmail = email.trim().toLowerCase();

    // Busca al usuario por email en la base de datos
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        throw { status: 401, message: 'Credenciales inválidas' };
    }

    // Compara la contraseña enviada con el hash almacenado en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: 'Credenciales inválidas' };
    }

    // Genera el token JWT por medio del userId como payload
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw { status: 500, message: 'JWT_SECRET no está configurado' };
    }

    const token = jwt.sign(
        { userId: user._id },
        secret,
        { expiresIn: '24h' }
    );

    return { token };
};

export default { register, login };
