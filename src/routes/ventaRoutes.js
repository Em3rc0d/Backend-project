// src/routes/ventaRoutes.js
const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Definir las rutas de las ventas
router.get('/', ventaController.obtenerVentas);
router.post('/', ventaController.crearVenta);
router.get('/filter', ventaController.filtrarVentas);
router.get('/:id', ventaController.obtenerVentaPorId);
router.put('/:id', ventaController.actualizarVenta);
router.delete('/:id', ventaController.eliminarVenta);

module.exports = router;
