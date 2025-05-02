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

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');  // Obtener el token del encabezado
    if (!token) {
        return res.status(403).json({ message: MESSAGES.TOKEN_MISSING });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: MESSAGES.TOKEN_INVALID });
        }

        req.userId = decoded.id; // Almacenar el ID del usuario decodificado
        next();
    });
};

// Middleware para verificar roles específicos
// Middleware para verificar roles específicos
const verifyRole = (roles) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;  // Obtener el userId del token

            // Log para verificar si userId es correcto
            console.log(`Verificando rol para el usuario con ID: ${userId}`);

            // Buscar usuario en la base de datos
            const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
            const user = rows[0];

            // Si no se encuentra el usuario
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            console.log('Usuario encontrado:', user);

            // Verificar que el rol del usuario esté permitido
            if (!roles.includes(user.rol)) {
                return res.status(403).json({ message: MESSAGES.ROLE_INSUFFICIENT });
            }

            req.userRol = user.rol;  // Almacenar el rol del usuario
            next();
        } catch (error) {
            console.error("Error en verifyRole:", error);
            res.status(500).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
        }
    };
};


module.exports = { verifyToken, verifyRole };
