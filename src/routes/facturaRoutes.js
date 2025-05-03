const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get('/filter', verifyRole(['admin', 'vendedor']), facturaController.filtrarFacturas);

router.get('/', verifyRole(['admin', 'vendedor']), facturaController.obtenerFacturas);

router.get('/:id', verifyRole(['admin', 'vendedor']), facturaController.obtenerFacturaPorId);

router.post('/', verifyRole(['admin', 'vendedor']), facturaController.crearFactura);

router.put('/:id', verifyRole(['admin', 'vendedor']), facturaController.actualizarFactura);

router.delete('/:id', verifyRole(['admin', 'vendedor']), facturaController.eliminarFactura);

module.exports = router;
