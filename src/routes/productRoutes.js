const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Rutas protegidas
router.get('/', verifyToken, verifyRole(['admin', 'vendedor']), productoController.obtenerProductos); // Admin y vendedor pueden obtener productos
router.post('/', verifyToken, verifyRole(['admin']), productoController.crearProducto); // Solo admin puede crear productos
router.get('/:id', verifyToken, verifyRole(['admin', 'vendedor']), productoController.obtenerProductoPorId); // Admin y vendedor pueden obtener productos por ID
router.put('/:id', verifyToken, verifyRole(['admin']), productoController.actualizarProducto); // Solo admin puede actualizar productos
router.delete('/:id', verifyToken, verifyRole(['admin']), productoController.eliminarProducto); // Solo admin puede eliminar productos

module.exports = router;
