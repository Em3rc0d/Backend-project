const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
    cliente: { 
        type: String, 
        required: [true, 'El nombre del cliente es obligatorio.'] 
    },
    fecha: { 
        type: Date, 
        default: Date.now 
    },
    estado: { 
        type: String, 
        enum: ['pendiente', 'completada', 'cancelada'], 
        default: 'pendiente' 
    },
    total: { 
        type: Number, 
        required: [true, 'El total de la venta es obligatorio.'], 
        min: [0, 'El total no puede ser negativo.'] 
    },
    productos: [
        {
            nombre: { 
                type: String, 
                required: [true, 'El nombre del producto es obligatorio.'] 
            },
            productoId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Producto', 
                required: [true, 'El ID del producto es obligatorio.'] 
            },
            cantidad: { 
                type: Number, 
                required: [true, 'La cantidad del producto es obligatoria.'], 
                min: [1, 'La cantidad debe ser al menos 1.'] 
            },
            precio_unitario: { 
                type: Number, 
                required: [true, 'El precio unitario del producto es obligatorio.'], 
                min: [0, 'El precio unitario no puede ser negativo.'] 
            },
            subtotal: { 
                type: Number, 
                required: [true, 'El subtotal del producto es obligatorio.'], 
                min: [0, 'El subtotal no puede ser negativo.'] 
            },
        },
    ],
});

// Crear un índice para optimizar consultas basadas en clientes
VentaSchema.index({ cliente: 1 });

module.exports = mongoose.model('Venta', VentaSchema);
