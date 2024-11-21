const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre del producto es obligatorio.'], 
        unique: true // Garantiza que los nombres sean únicos
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

// Crear un índice único en el campo `nombre` para evitar duplicados en la base de datos
ProductoSchema.index({ nombre: 1 }, { unique: true });

ProductoSchema.path('nombre').validate(async (value) => {
    const count = await mongoose.models.Producto.countDocuments({ nombre: value });
    return count === 0;
}, 'El producto con el nombre "{VALUE}" ya existe.');


module.exports = mongoose.model('Producto', ProductoSchema);
