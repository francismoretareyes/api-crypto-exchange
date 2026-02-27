import 'dotenv/config';
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT;

// Función para iniciar el servidor, se conecte a la base de datos y escuche las peticiones al puerto.
const startServer = async () => {
    try {
        await connectDB();
        console.log('Conexión a la base de datos exitosa');

        if (!PORT) {
            throw new Error('FATAL ERROR: PORT no está definido.');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
