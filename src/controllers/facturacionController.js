<<<<<<< HEAD
const facturacionService = require('../services/facturacionServices');

class FacturacionController {
  async createInvoice(req, res) {
    try {
      const result = await facturacionService.createInvoice(req.body);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getLastInvoiceNumber(req, res) {
    try {
      const result = await facturacionService.getLastInvoiceNumber();
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new FacturacionController();
=======
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
>>>>>>> b498e1ac6238fe41eb9c3c1cd9becdb4d3cffc67
