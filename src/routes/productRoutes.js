const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, verifyRole(['admin', 'vendedor']), productoController.obtenerProductos); 
router.post('/', verifyToken, verifyRole(['admin']), productoController.crearProducto); 
router.get('/:id', verifyToken, verifyRole(['admin', 'vendedor']), productoController.obtenerProductoPorId);
router.put('/:id', verifyToken, verifyRole(['admin']), productoController.actualizarProducto); 
router.delete('/:id', verifyToken, verifyRole(['admin']), productoController.eliminarProducto);

module.exports = router;
