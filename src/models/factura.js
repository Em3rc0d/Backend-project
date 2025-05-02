const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); 
const Venta = require('./venta');

const Factura = sequelize.define('Factura', {
    numero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    cliente: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ruc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('emitida', 'anulada'),
        defaultValue: 'emitida',
    },
    productos: {
        type: DataTypes.JSONB, // Guardamos productos en JSON
    },
});
Factura.belongsTo(Venta, { foreignKey: 'ventaId' });

module.exports = Factura;
