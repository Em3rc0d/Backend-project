const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); 

const Proveedor = sequelize.define('Proveedor', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 100],
        },
    },
    direccion: {
        type: DataTypes.STRING(200),
    },
    telefono: {
        type: DataTypes.STRING,
        validate: {
            is: /^[0-9]{9}$/,
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
});

module.exports = Proveedor;
