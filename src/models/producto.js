const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Categoria = require('./categoria');
const Proveedor = require('./proveedor');

const Producto = sequelize.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    precio_unitario: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    cantidad_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categoria,
            key: 'id',
        },
    },
    proveedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Proveedor,
            key: 'id',
        },
    },
});

Producto.belongsTo(Categoria, { foreignKey: 'categoria' });
Producto.belongsTo(Proveedor, { foreignKey: 'proveedor' });

module.exports = Producto;
