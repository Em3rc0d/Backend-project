const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

// Agrega tus rutas
router.get('/', proveedorController.obtenerProveedores);
router.post('/', proveedorController.crearProveedor);

module.exports = router;
