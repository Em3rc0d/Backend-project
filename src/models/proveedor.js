const mongoose = require('mongoose');

// Función para validar el formato de correo electrónico
const emailValidator = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

// Función para validar el formato de teléfono
const telefonoValidator = (telefono) => {
    const regex = /^[0-9]{9}$/;  // Validación simple para números de teléfono de 9 dígitos
    return regex.test(telefono);
};

const ProveedorSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre del proveedor es obligatorio'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'], 
        maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
    },
    direccion: { 
        type: String, 
        maxlength: [200, 'La dirección no puede tener más de 200 caracteres']
    },
    telefono: { 
        type: String, 
        validate: {
            validator: telefonoValidator,
            message: 'El teléfono debe contener 9 dígitos.'
        }
    },
    email: { 
        type: String, 
        required: [true, 'El correo electrónico es obligatorio'], 
        unique: true,
        validate: {
            validator: emailValidator,
            message: 'Por favor, ingrese un correo electrónico válido.'
        }
    }
});

// Crear un índice único para el campo 'email' para garantizar que no haya duplicados
ProveedorSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Proveedor', ProveedorSchema);
