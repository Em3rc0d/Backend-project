const express = require('express');
const cors = require('cors');
const productoRoutes = require('./src/routes/productRoutes');
const facturaRoutes = require('./src/routes/facturaRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');
const authRoutes = require('./src/routes/authRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const proveedorRoutes = require('./src/routes/proveedorRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const { verifyToken } = require('./src/middleware/authMiddleware'); // Importar correctamente el middleware

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})); // Habilitar CORS para todas las URLs
app.use(express.json()); // Para parsear los cuerpos de las solicitudes JSON

const connectDatabase = require('./src/config/database');

// Conectar a la base de datos
connectDatabase();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/ventas', verifyToken, ventaRoutes); // Ruta de ventas
app.use('/api/productos', verifyToken, productoRoutes); // Ruta de productos
app.use('/api/facturas', verifyToken, facturaRoutes); // Ruta de facturas
app.use('/api/categorias', verifyToken, categoriaRoutes);
app.use('/api/proveedores', verifyToken, proveedorRoutes);
app.use('/api/usuarios', verifyToken, usuarioRoutes);

app.get('/', (req, res) => {
    res.send('API en funcionamiento');
});

module.exports = app;
