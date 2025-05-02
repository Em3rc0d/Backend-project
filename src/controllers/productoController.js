const { pool } = require('../config/database');

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM productos');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: error.message });
    }
};

// Crear o actualizar un producto (incrementar stock si ya existe)
exports.crearProducto = async (req, res) => {
    const { nombre, precio_unitario, cantidad_stock, categoria, proveedor } = req.body;

    try {
        // Buscar producto por nombre
        const { rows } = await pool.query('SELECT * FROM productos WHERE nombre = $1', [nombre]);

        if (rows.length > 0) {
            // Si el producto existe, actualizar stock
            const productoExistente = rows[0];
            const nuevoStock = productoExistente.cantidad_stock + (cantidad_stock || 0);
            const { rows: productoActualizado } = await pool.query(
                'UPDATE productos SET cantidad_stock = $1 WHERE id = $2 RETURNING *',
                [nuevoStock, productoExistente.id]
            );
            return res.status(200).json({
                message: 'Stock actualizado',
                producto: productoActualizado[0],
            });
        }

        // Crear un nuevo producto
        const { rows: nuevoProducto } = await pool.query(
            'INSERT INTO productos (nombre, precio_unitario, cantidad_stock, categoria, proveedor) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, precio_unitario, cantidad_stock, categoria, proveedor]
        );

        res.status(201).json({
            message: 'Producto creado exitosamente',
            producto: nuevoProducto[0],
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(400).json({
            message: 'Error al procesar la solicitud',
            error: error.message,
        });
    }
};

// Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un producto por ID
exports.actualizarProducto = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'UPDATE productos SET nombre = $1, precio_unitario = $2, cantidad_stock = $3, categoria = $4, proveedor = $5 WHERE id = $6 RETURNING *',
            [req.body.nombre, req.body.precio_unitario, req.body.cantidad_stock, req.body.categoria, req.body.proveedor, req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un producto por ID
exports.eliminarProducto = async (req, res) => {
    try {
        const { rows } = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: error.message });
    }
};
