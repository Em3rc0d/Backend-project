const { pool } = require('../config/database');
const Producto = require('../models/producto');

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM ventas');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva venta con verificación de stock
exports.crearVenta = async (req, res) => {
    const { productos, cliente, fecha, estado } = req.body;

    // Validar que cliente, productos y su estructura sean correctos
    if (!cliente || !productos || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({
            message: "Datos incompletos: cliente o productos faltantes o con formato incorrecto.",
        });
    }

    // Sanitizar productos para asegurar que solo procesamos lo necesario
    const productosSanitizados = productos.map(({ productoId, cantidad }) => ({
        productoId,
        cantidad,
    }));

    const client = await pool.connect();

    try {
        await client.query('BEGIN');  // Iniciar transacción

        const detalleProductos = [];
        let total = 0;

        for (const item of productosSanitizados) {
            // Validar estructura de producto
            if (!item.productoId || !item.cantidad || item.cantidad <= 0) {
                throw new Error("Cada producto debe tener un ID válido y una cantidad mayor a 0.");
            }

            // Buscar producto en la base de datos
            const { rows: producto } = await client.query('SELECT * FROM productos WHERE id = $1', [item.productoId]);

            if (producto.length === 0) {
                throw new Error(`Producto con ID ${item.productoId} no encontrado.`);
            }

            // Validar stock
            if (producto[0].cantidad_stock < item.cantidad) {
                throw new Error(
                    `Stock insuficiente para el producto "${producto[0].nombre}". 
                    Disponible: ${producto[0].cantidad_stock}, Requerido: ${item.cantidad}.`
                );
            }

            // Calcular subtotal y reducir stock
            const subtotal = producto[0].precio_unitario * item.cantidad;
            total += subtotal;

            // Reducir stock
            await client.query('UPDATE productos SET cantidad_stock = cantidad_stock - $1 WHERE id = $2', [item.cantidad, item.productoId]);

            // Agregar al detalle de productos
            detalleProductos.push({
                nombre: producto[0].nombre,
                productoId: producto[0].id,
                precio_unitario: producto[0].precio_unitario,
                cantidad: item.cantidad,
                subtotal,
            });
        }

        // Crear y guardar la venta
        const { rows: nuevaVenta } = await client.query(
            'INSERT INTO ventas (cliente, total, fecha, estado) VALUES ($1, $2, $3, $4) RETURNING id',
            [cliente, total, fecha || new Date(), estado || 'pendiente']
        );

        // Guardar detalles de productos
        for (const item of detalleProductos) {
            await client.query(
                'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
                [nuevaVenta[0].id, item.productoId, item.cantidad, item.precio_unitario, item.subtotal]
            );
        }

        await client.query('COMMIT');  // Confirmar transacción
        res.status(201).json({
            message: "Venta registrada exitosamente.",
            venta: nuevaVenta[0],
        });
    } catch (error) {
        await client.query('ROLLBACK');  // Revertir transacción en caso de error
        console.error("Error al registrar la venta:", error);
        res.status(400).json({
            message: "Error al registrar la venta.",
            error: error.message,
        });
    } finally {
        client.release();  // Liberar el cliente de la base de datos
    }
};

// Obtener venta por ID
exports.obtenerVentaPorId = async (req, res) => {
    try {
        const { rows: venta } = await pool.query(
            'SELECT * FROM ventas WHERE id = $1', [req.params.id]
        );

        if (venta.length === 0) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        const { rows: detalles } = await pool.query(
            'SELECT * FROM detalle_ventas WHERE venta_id = $1', [venta[0].id]
        );

        venta[0].detalles = detalles;

        res.status(200).json(venta[0]);
    } catch (error) {
        console.error('Error al obtener la venta:', error);
        res.status(500).json({ message: error.message });
    }
};

// Actualizar venta por ID
exports.actualizarVenta = async (req, res) => {
    const { productos } = req.body;

    try {
        const { rows: venta } = await pool.query('SELECT * FROM ventas WHERE id = $1', [req.params.id]);

        if (venta.length === 0) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        let totalVenta = 0;
        const detalles = [];

        for (const item of productos) {
            const { rows: producto } = await pool.query('SELECT * FROM productos WHERE id = $1', [item.productoId]);
            const subtotal = producto[0].precio_unitario * item.cantidad;
            totalVenta += subtotal;
            detalles.push({
                productoId: item.productoId,
                cantidad: item.cantidad,
                subtotal,
            });
        }

        // Actualizar venta y detalles
        await pool.query('UPDATE ventas SET total = $1 WHERE id = $2', [totalVenta, req.params.id]);

        for (const detalle of detalles) {
            await pool.query(
                'UPDATE detalle_ventas SET cantidad = $1, subtotal = $2 WHERE venta_id = $3 AND producto_id = $4',
                [detalle.cantidad, detalle.subtotal, req.params.id, detalle.productoId]
            );
        }

        res.status(200).json({ message: "Venta actualizada con éxito" });
    } catch (error) {
        console.error('Error al actualizar la venta:', error);
        res.status(400).json({ message: error.message });
    }
};

// Eliminar venta por ID
exports.eliminarVenta = async (req, res) => {
    try {
        const { rows: venta } = await pool.query('SELECT * FROM ventas WHERE id = $1', [req.params.id]);
        if (venta.length === 0) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        await pool.query('DELETE FROM ventas WHERE id = $1', [req.params.id]);
        await pool.query('DELETE FROM detalle_ventas WHERE venta_id = $1', [req.params.id]);

        res.status(200).json({ message: "Venta eliminada" });
    } catch (error) {
        console.error('Error al eliminar la venta:', error);
        res.status(500).json({ message: error.message });
    }
};

// Filtrar ventas
exports.filtrarVentas = async (req, res) => {
    try {
        const { tipoFiltro, fechaDesde, fechaHasta, estado, cliente, totalMinimo, totalMaximo } = req.query;

        let query = 'SELECT * FROM ventas WHERE 1=1';
        const params = [];

        if (tipoFiltro === "Fecha") {
            if (fechaDesde) {
                query += ' AND fecha >= $' + (params.length + 1);
                params.push(new Date(fechaDesde));
            }
            if (fechaHasta) {
                query += ' AND fecha <= $' + (params.length + 1);
                params.push(new Date(fechaHasta));
            }
        }

        if (estado) {
            query += ' AND estado = $' + (params.length + 1);
            params.push(estado);
        }

        if (cliente) {
            query += ' AND cliente ILIKE $' + (params.length + 1);
            params.push('%' + cliente + '%');
        }

        if (totalMinimo) {
            query += ' AND total >= $' + (params.length + 1);
            params.push(parseFloat(totalMinimo));
        }

        if (totalMaximo) {
            query += ' AND total <= $' + (params.length + 1);
            params.push(parseFloat(totalMaximo));
        }

        const { rows } = await pool.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al filtrar ventas:', error);
        res.status(500).json({ message: error.message });
    }
};
