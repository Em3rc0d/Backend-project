const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
    cliente: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    estado: { type: String, enum: ['pendiente', 'completada', 'cancelada'], default: 'pendiente' },
    total: { type: Number, required: true },
    productos: [
        {
            productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
            cantidad: { type: Number, required: true },
            precio_unitario: { type: Number, required: true },
            subtotal: { type: Number, required: true },
        },
    ],
});

module.exports = mongoose.model('Venta', VentaSchema);
