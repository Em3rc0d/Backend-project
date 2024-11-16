// src/routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Definir las rutas de los productos
router.get('/', productoController.obtenerProductos);
router.post('/', productoController.crearProducto);
router.get('/:id', productoController.obtenerProductoPorId);
router.put('/:id', productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

module.exports = router;
