// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();

// Obtener todos los productos
router.get('/', (req, res) => {
    res.send("Obtener todos los productos");
});

// Crear un nuevo producto
router.post('/', (req, res) => {
    const newProduct = req.body;
    res.send(`Nuevo producto creado: ${JSON.stringify(newProduct)}`);
});

// Actualizar un producto
router.put('/:id', (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    res.send(`Producto con ID ${productId} actualizado: ${JSON.stringify(updatedProduct)}`);
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
    const productId = req.params.id;
    res.send(`Producto con ID ${productId} eliminado`);
});

module.exports = router;
