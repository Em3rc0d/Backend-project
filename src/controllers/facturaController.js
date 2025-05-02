const { pool } = require('../config/database');

// Filtrar facturas con parámetros opcionales
exports.filtrarFacturas = async (req, res) => {
    const { fechaInicio, fechaFin, cliente, montoMinimo, montoMaximo, estado, pagina = 1, limite = 10 } = req.query;

    // Construir la consulta SQL
    let query = 'SELECT * FROM facturas WHERE 1=1';
    let params = [];

    // Filtro por Fecha
    if (fechaInicio) {
        query += ' AND fecha >= $' + (params.length + 1);
        params.push(new Date(fechaInicio));
    }
    if (fechaFin) {
        query += ' AND fecha <= $' + (params.length + 1);
        params.push(new Date(fechaFin));
    }

    // Filtro por Cliente
    if (cliente) {
        query += ' AND cliente ILIKE $' + (params.length + 1);
        params.push(`%${cliente}%`);
    }

    // Filtro por Monto
    if (montoMinimo) {
        query += ' AND total >= $' + (params.length + 1);
        params.push(parseFloat(montoMinimo));
    }
    if (montoMaximo) {
        query += ' AND total <= $' + (params.length + 1);
        params.push(parseFloat(montoMaximo));
    }

    // Filtro por Estado
    if (estado) {
        query += ' AND estado = $' + (params.length + 1);
        params.push(estado);
    }

    // Paginación
    query += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limite, (pagina - 1) * limite);

    try {
        const { rows } = await pool.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al filtrar las facturas:', error);
        res.status(500).json({ message: 'Error al filtrar las facturas', error: error.message });
    }
};

// Obtener todas las facturas
exports.obtenerFacturas = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM facturas');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        res.status(500).json({ message: 'Error al obtener las facturas', error: error.message });
    }
};

// Obtener una factura por ID
exports.obtenerFacturaPorId = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM facturas WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la factura:', error);
        res.status(500).json({ message: 'Error al obtener la factura', error: error.message });
    }
};

// Crear factura
exports.crearFactura = async (req, res) => {
    const { ventaId, productos, total, cliente, direccion, ruc, telefono } = req.body;

    // Verificar que todos los campos requeridos estén presentes
    if (!ventaId || !productos || !total || !cliente || !direccion || !ruc || !telefono) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        const { rows } = await pool.query(
            'INSERT INTO facturas (venta_id, productos, total, cliente, direccion, ruc, telefono) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [ventaId, productos, total, cliente, direccion, ruc, telefono]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(400).json({ message: 'Error al crear la factura', error: error.message });
    }
};

// Actualizar una factura existente
exports.actualizarFactura = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'UPDATE facturas SET venta_id = $1, productos = $2, total = $3, cliente = $4, direccion = $5, ruc = $6, telefono = $7 WHERE id = $8 RETURNING *',
            [req.body.ventaId, req.body.productos, req.body.total, req.body.cliente, req.body.direccion, req.body.ruc, req.body.telefono, req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error al actualizar la factura:', error);
        res.status(400).json({ message: 'Error al actualizar la factura', error: error.message });
    }
};

// Eliminar una factura
exports.eliminarFactura = async (req, res) => {
    try {
        const { rows } = await pool.query('DELETE FROM facturas WHERE id = $1 RETURNING *', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        res.status(200).json({ message: 'Factura eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar la factura:', error);
        res.status(500).json({ message: 'Error al eliminar la factura', error: error.message });
    }
};
