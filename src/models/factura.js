const mongoose = require('mongoose');

const FacturaSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },
    fecha: { type: Date, default: Date.now },
    ventaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venta', required: true },
    total: { type: Number, required: true },
    cliente: { type: String, required: true },
    direccion: { type: String, required: true },  // New field for client address
    ruc: { type: String, required: true },  // New field for client RUC
    telefono: { type: String, required: true },  // New field for client phone number
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

// Pre-save hook to populate Factura fields from related Venta
FacturaSchema.pre('save', async function(next) {
    if (this.isNew) {
        const venta = await mongoose.model('Venta').findById(this.ventaId);
        if (venta) {
            // Copy relevant data from Venta to Factura
            this.cliente = venta.cliente;
            this.total = venta.total;
            this.productos = venta.productos;
            // Populate client-specific fields
            this.direccion = venta.direccion || ''; // Assuming you have this in Venta
            this.ruc = venta.ruc || ''; // Assuming you have this in Venta
            this.telefono = venta.telefono || ''; // Assuming you have this in Venta
        }
    }
    next();
});

module.exports = mongoose.model('Factura', FacturaSchema);
