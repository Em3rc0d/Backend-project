// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para procesar JSON
app.use(express.json());

// Importar las rutas
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const productRoutes = require('./src/routes/productRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const salesHistoryRoutes = require('./src/routes/salesHistoryRoutes');

// Configuración de rutas
app.use('/inventory', inventoryRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/notification', notificationRoutes);
app.use('/product', productRoutes);
app.use('/sale', saleRoutes);
app.use('/sales-history', salesHistoryRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
