const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    precio_unitario: { 
        type: Number, 
        required: true, 
        min: [0, 'El precio no puede ser negativo.'] 
    },
    cantidad_stock: { 
        type: Number, 
        required: true, 
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

module.exports = mongoose.model('Producto', ProductoSchema);
