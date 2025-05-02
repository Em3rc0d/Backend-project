const fs = require('fs');
const path = require('path');
const { pool } = require('./database'); // Usamos el pool ya creado

async function initPostgres() {
    try {
        const sqlPath = path.join(__dirname, '../SQLcomands/database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await pool.query(sql);
        console.log('📦 Base de datos PostgreSQL inicializada correctamente desde database.sql');
    } catch (err) {
        console.error('❌ Error al inicializar PostgreSQL:', err);
    }
}

module.exports = initPostgres;
