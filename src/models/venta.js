const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); 
const Factura = require('./factura');

const Venta = sequelize.define('Venta', {
    cliente: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
        defaultValue: 'pendiente',
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    productos: {
        type: DataTypes.JSONB, // Usamos JSONB para guardar array de productos
    },
});
Venta.hasMany(Factura, { foreignKey: 'ventaId' });

module.exports = Venta;
