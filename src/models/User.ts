import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/IUser';

/**
 * Schema de los Usuarios.
 */
const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model<IUser>('User', userSchema);
