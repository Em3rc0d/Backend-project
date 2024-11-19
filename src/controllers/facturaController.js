const Factura = require('../models/factura');

exports.filtrarFacturas = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, cliente, montoMinimo, montoMaximo, estado } = req.query;

        let query = {};

        // Filtro por Fecha (si se proporciona fechaInicio o fechaFin)
        if (fechaInicio || fechaFin) {
            query.fecha = {};
            if (fechaInicio) {
                query.fecha.$gte = new Date(fechaInicio); // Fecha de inicio
            }
            if (fechaFin) {
                query.fecha.$lte = new Date(fechaFin); // Fecha de fin
            }
        }

        // Filtro por Cliente (si se proporciona cliente)
        if (cliente) {
            query.cliente = { $regex: cliente, $options: 'i' };  // Coincidencias parciales (sin distinguir mayúsculas/minúsculas)
        }

        // Filtro por Monto (si se proporcionan montoMinimo o montoMaximo)
        if (montoMinimo || montoMaximo) {
            query.total = {};
            if (montoMinimo) {
                query.total.$gte = parseFloat(montoMinimo); // Monto mínimo
            }
            if (montoMaximo) {
                query.total.$lte = parseFloat(montoMaximo); // Monto máximo
            }
        }

        // Filtro por Estado (si se proporciona estado)
        if (estado) {
            query.estado = estado; // Coincidencia exacta con el estado
        }

        // Buscar las facturas con el filtro aplicado
        const facturas = await Factura.find(query);

        // Retornar las facturas que cumplen con los filtros
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Obtener todas las facturas
exports.obtenerFacturas = async (req, res) => {
    try {
        const facturas = await Factura.find();
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las facturas', error });
    }
};

// Obtener una factura por ID
exports.obtenerFacturaPorId = async (req, res) => {
    try {
        const factura = await Factura.findById(req.params.id);
        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        res.json(factura);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la factura', error });
    }
};

// Crear una nueva factura
exports.crearFactura = async (req, res) => {
    try {
        const nuevaFactura = new Factura(req.body);
        const facturaGuardada = await nuevaFactura.save();
        res.status(201).json(facturaGuardada);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la factura', error });
    }
};

// Actualizar una factura existente
exports.actualizarFactura = async (req, res) => {
    try {
        const factura = await Factura.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        res.json(factura);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la factura', error });
    }
};

// Eliminar una factura
exports.eliminarFactura = async (req, res) => {
    try {
        const factura = await Factura.findByIdAndDelete(req.params.id);
        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        res.json({ message: 'Factura eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la factura', error });
    }
};
