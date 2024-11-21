const mongoose = require('mongoose');
const FacturaSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },
    fecha: { type: Date, default: Date.now },
    ventaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venta', required: true },
    total: { type: Number, required: true },
    cliente: { type: String, required: true },
    direccion: { type: String, required: true },
    ruc: { type: String, required: true },
    telefono: { type: String, required: true },
    estado: { type: String, enum: ['emitida', 'anulada'], default: 'emitida' },
    productos: [
        {
            productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
            cantidad: { type: Number, required: true },
            precio_unitario: { type: Number, required: true },
            subtotal: { type: Number, required: true },
        },
    ],
});

// Pre-save hook para llenar los campos de la factura desde la venta relacionada
FacturaSchema.pre('save', async function (next) {
    if (this.isNew) {
        const venta = await mongoose.model('Venta').findById(this.ventaId);
        if (!venta) {
            return next(new Error('Venta no encontrada.'));
        }
        // Copiar datos relevantes de la venta
        this.cliente = venta.cliente;
        this.total = venta.total;
        this.productos = venta.productos;
        this.direccion = venta.direccion || '';
        this.ruc = venta.ruc || '';
        this.telefono = venta.telefono || '';
    }
    next();
});

module.exports = mongoose.model('Factura', FacturaSchema);