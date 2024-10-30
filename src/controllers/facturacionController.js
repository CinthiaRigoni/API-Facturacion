const facturacionServices = require('../services/facturacionServices');

// Función para generar el comprobante
const generarComprobante = async (req, res) => {
  try {
    const {
      cuitCliente, ptoVenta, comprobante, concepto,
      tipoDoc, nroDoc, importeGravado, importeIva, importeExentoIva
    } = req.body;

    const response = await facturacionServices.generarComprobante(
      cuitCliente, ptoVenta, comprobante, concepto,
      tipoDoc, nroDoc, importeGravado, importeIva, importeExentoIva
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Error en controlador:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generarComprobante };
