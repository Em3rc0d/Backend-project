const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String },
    telefono: { type: String },
    email: { type: String, unique: true },
});

module.exports = mongoose.model('Proveedor', ProveedorSchema);
