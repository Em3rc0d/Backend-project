const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware'); // Middleware de autenticación y autorización

// Rutas de ventas
router.get('/', verifyToken, ventaController.obtenerVentas); // Cualquier usuario puede obtener ventas
router.post('/', verifyToken, ventaController.crearVenta); // Admin y vendedor pueden crear ventas
router.get('/filter', verifyToken, ventaController.filtrarVentas); // Cualquier usuario puede filtrar ventas
router.get('/:id', verifyToken, ventaController.obtenerVentaPorId); // Cualquier usuario puede obtener venta por ID
router.put('/:id', verifyRole(['admin']), ventaController.actualizarVenta); // Solo admin puede actualizar ventas
router.delete('/:id', verifyRole(['admin']), ventaController.eliminarVenta); // Solo admin puede eliminar ventas

module.exports = router;
