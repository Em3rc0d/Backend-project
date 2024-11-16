const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio_unitario: { type: Number, required: true },
    cantidad_stock: { type: Number, required: true },
    categoria: { type: String },
    proveedor: { type: String },
});

module.exports = mongoose.model('Producto', ProductoSchema);
