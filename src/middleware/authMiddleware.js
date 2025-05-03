const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
require('dotenv').config();
const { pool } = require('../config/database');

const MESSAGES = {
    TOKEN_MISSING: 'Token no proporcionado',
    TOKEN_INVALID: 'Token inválido o expirado',
    ROLE_INSUFFICIENT: 'Acceso denegado: Rol insuficiente',
    SERVER_ERROR: 'Error en el servidor',
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
        return res.status(403).json({ message: MESSAGES.TOKEN_MISSING });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: MESSAGES.TOKEN_INVALID });
        }

        req.userId = decoded.id; 
        next();
    });
};

const verifyRole = (roles) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;  

            const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
            const user = rows[0];

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            if (!roles.includes(user.rol)) {
                return res.status(403).json({ message: MESSAGES.ROLE_INSUFFICIENT });
            }

            req.userRol = user.rol; 
            next();
        } catch (error) {
            console.error("Error en verifyRole:", error);
            res.status(500).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
        }
    };
};


module.exports = { verifyToken, verifyRole };
