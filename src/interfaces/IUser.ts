import { Document } from 'mongoose';

/**
 * Interfaz que define la estructura que debe tener un usuario en la base de datos.
 */
export interface IUser extends Document {
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
