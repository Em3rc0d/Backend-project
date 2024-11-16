const mongoose = require('mongoose');
require('dotenv').config();

const connectDatabase = async () => {
    try {
        const dbURI = process.env.MONGODB_URI;
        if (!dbURI) {
            console.log('MongoDB URI no está definida');
            return;
        }
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

module.exports = connectDatabase;
