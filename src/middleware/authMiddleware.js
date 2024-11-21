const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
require('dotenv').config();

const MESSAGES = {
    TOKEN_MISSING: 'Token no proporcionado',
    TOKEN_INVALID: 'Token inválido o expirado',
    ROLE_INSUFFICIENT: 'Acceso denegado: Rol insuficiente',
    SERVER_ERROR: 'Error en el servidor',
};

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
        return res.status(403).json({ message: MESSAGES.TOKEN_MISSING });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: MESSAGES.TOKEN_INVALID });
        }

        req.userId = decoded.id; // Almacenar el ID del usuario
        next();
    });
};

// Middleware para verificar roles específicos
const verifyRole = (roles) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId; // Usar el userId del middleware anterior

            // Buscar usuario en la base de datos
            const user = await Usuario.findById(userId);
            if (!user || !roles.includes(user.rol)) {
                return res.status(403).json({ message: MESSAGES.ROLE_INSUFFICIENT });
            }

            req.userRol = user.rol; // Almacenar rol del usuario
            next();
        } catch (error) {
            console.error("Error en verifyRole:", error);
            res.status(500).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
        }
    };
};

// Exportar las funciones
module.exports = { verifyToken, verifyRole };
