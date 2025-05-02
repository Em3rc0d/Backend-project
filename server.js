require('dotenv').config();
const app = require('./app');
const { connectDatabase, sequelize } = require('./src/config/database');
const initPostgres = require('./src/config/initPostgresql');

// Configuración del puerto
const PORT = process.env.PORT || 3000;

(async () => {
    try {
        // Conectar a la base de datos PostgreSQL
        await connectDatabase();
        console.log('Conexión a PostgreSQL exitosa');

        // Ejecutar las inicializaciones de tablas y datos
        await initPostgres(); // Ejecuta el archivo SQL si no existen las tablas

        // Sincronizar los modelos de Sequelize
        await sequelize.sync({ force: false });  // Esto asegura que las tablas se mantengan sin borrarlas
        console.log('Tablas sincronizadas con la base de datos');

        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
    }
})();