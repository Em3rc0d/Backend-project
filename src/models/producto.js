const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre del producto es obligatorio.'], 
        unique: true // Garantiza que los nombres sean únicos en la base de datos
    },
    precio_unitario: { 
        type: Number, 
        required: [true, 'El precio unitario es obligatorio.'], 
        min: [0, 'El precio no puede ser negativo.'] 
    },
    cantidad_stock: { 
        type: Number, 
        required: [true, 'La cantidad en stock es obligatoria.'], 
        min: [0, 'La cantidad en stock no puede ser negativa.'], 
        default: 0 
    },
    categoria: { 
        type: String, 
        required: [true, 'La categoría es obligatoria.'] 
    },
    proveedor: { 
        type: String, 
        required: [true, 'El proveedor es obligatorio.'] 
    },
});

// Crear un índice único en el campo `nombre`
ProductoSchema.index({ nombre: 1 }, { unique: true });

module.exports = mongoose.model('Producto', ProductoSchema);
