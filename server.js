// src/server.js
require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./src/config/database');

// Conectar a la base de datos
connectDatabase();

// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
