const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Rutas protegidas
router.get('/', verifyRole(['admin', 'vendedor']), categoriaController.obtenerCategorias); // Acceso para admin y vendedor
router.post('/', verifyRole(['admin']), categoriaController.crearCategoria); // Solo admin

module.exports = router;
