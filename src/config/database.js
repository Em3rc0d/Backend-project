// config/database.js
const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRESQL_URI, {
    dialect: 'postgres',
    logging: false, 
});

const pool = new Pool({
    connectionString: process.env.POSTGRESQL_URI
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a PostgreSQL exitosa con Sequelize');
    } catch (error) {
        console.error('Error al conectar a la base de datos con Sequelize:', error);
    }
};

module.exports = { connectDatabase, sequelize, pool }; 
