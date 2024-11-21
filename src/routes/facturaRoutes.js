const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware'); // Middleware de autenticación y autorización

// Obtener facturas con filtro
router.get('/filter', verifyRole(['admin', 'vendedor']), facturaController.filtrarFacturas);

// Obtener todas las facturas
router.get('/', verifyRole(['admin', 'vendedor']), facturaController.obtenerFacturas);

// Obtener una factura por ID
router.get('/:id', verifyRole(['admin', 'vendedor']), facturaController.obtenerFacturaPorId);

// Crear una nueva factura
router.post('/', verifyRole(['admin', 'vendedor']), facturaController.crearFactura);

// Actualizar una factura existente
router.put('/:id', verifyRole(['admin', 'vendedor']), facturaController.actualizarFactura);

// Eliminar una factura
router.delete('/:id', verifyRole(['admin', 'vendedor']), facturaController.eliminarFactura);

module.exports = router;
