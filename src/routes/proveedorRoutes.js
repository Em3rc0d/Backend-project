const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Agrega tus rutas
router.get('/', verifyRole(['admin', 'vendedor']), proveedorController.obtenerProveedores);
router.post('/', verifyRole(['admin']), proveedorController.crearProveedor);

module.exports = router;
