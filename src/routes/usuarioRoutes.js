const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Agrega tus rutas
router.get('/', usuarioController.obtenerUsuarios);
router.post('/', usuarioController.crearUsuario);

module.exports = router;
