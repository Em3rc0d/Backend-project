const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Rutas de usuarios
router.get('/', verifyRole(['admin']), usuarioController.obtenerUsuarios); // Solo admin puede obtener usuarios
router.post('/', verifyRole(['admin']), usuarioController.crearUsuario); // Solo admin puede crear usuarios

module.exports = router;
