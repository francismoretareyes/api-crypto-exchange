import mongoose from 'mongoose';

/**
 * Conexión de la API con la base de datos MongoDB con la dependencia Mongoose.
 * @returns {Promise<void>} Una promesa que se resuelve si la conexión tiene éxito.
 */
const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('FATAL ERROR: MONGO_URI no está definido.');
        }
        await mongoose.connect(mongoURI);
        console.log('🗂️ Conexión a MongoDB establecida con éxito');
    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ Error al conectar a MongoDB:', error.message);
        } else {
            console.error('❌ Error inesperado al conectar a MongoDB');
        }
        process.exit(1);
    }
};

export default connectDB;
