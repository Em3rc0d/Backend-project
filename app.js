const express = require('express');
const cors = require('cors'); // Importar cors
const productoRoutes = require('./src/routes/productRoutes');
const facturaRoutes = require('./src/routes/facturaRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');
const authRoutes = require('./src/routes/authRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const proveedorRoutes = require('./src/routes/proveedorRoutes');

const app = express();

// Middleware
app.use(cors(
    {
        origin: '*'
    },
    {
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
)); // Habilitar CORS para todas las URLs
app.use(express.json()); // Para parsear los cuerpos de las solicitudes JSON

// Rutas
app.use('/api/ventas', ventaRoutes); // Ruta de ventas
app.use('/api/productos', productoRoutes); // Ruta de productos
app.use('/api/facturas', facturaRoutes); // Ruta de facturas
app.use('/api/auth', authRoutes); // Ruta de autenticación
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);

module.exports = app;
