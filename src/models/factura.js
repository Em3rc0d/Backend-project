const mongoose = require('mongoose');

const FacturaSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },
    fecha: { type: Date, default: Date.now },
    ventaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venta', required: true },
    total: { type: Number, required: true },
    cliente: { type: String, required: true },
    estado: { type: String, enum: ['emitida', 'anulada'], default: 'emitida' },
});

module.exports = mongoose.model('Factura', FacturaSchema);
