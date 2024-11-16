const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Agrega tus rutas
router.get('/', categoriaController.obtenerCategorias);
router.post('/', categoriaController.crearCategoria);

module.exports = router;
