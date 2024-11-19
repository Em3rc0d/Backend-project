const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');

// Obtener facturas con filtro
router.get('/filter', facturaController.filtrarFacturas);

// Obtener todas las facturas
router.get('/', facturaController.obtenerFacturas);

// Obtener una factura por ID
router.get('/:id', facturaController.obtenerFacturaPorId);

// Crear una nueva factura
router.post('/', facturaController.crearFactura);

// Actualizar una factura existente
router.put('/:id', facturaController.actualizarFactura);

// Eliminar una factura
router.delete('/:id', facturaController.eliminarFactura);

module.exports = router;
