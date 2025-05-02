const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); 

const Categoria = sequelize.define('Categoria', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: DataTypes.STRING,
    },
});

module.exports = Categoria;
