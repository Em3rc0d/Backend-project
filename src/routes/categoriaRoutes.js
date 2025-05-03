const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get('/', verifyRole(['admin', 'vendedor']), categoriaController.obtenerCategorias);
router.post('/', verifyRole(['admin']), categoriaController.crearCategoria);

module.exports = router;
