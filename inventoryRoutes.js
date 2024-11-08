// src/routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();

// Obtener todos los items del inventario
router.get('/', (req, res) => {
    res.send("Obtener todos los items del inventario");
});

// Agregar un nuevo item al inventario
router.post('/', (req, res) => {
    const newItem = req.body;
    res.send(`Nuevo item agregado al inventario: ${JSON.stringify(newItem)}`);
});

// Actualizar un item del inventario
router.put('/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedItem = req.body;
    res.send(`Item con ID ${itemId} actualizado: ${JSON.stringify(updatedItem)}`);
});

// Eliminar un item del inventario
router.delete('/:id', (req, res) => {
    const itemId = req.params.id;
    res.send(`Item con ID ${itemId} eliminado del inventario`);
});

module.exports = router;
