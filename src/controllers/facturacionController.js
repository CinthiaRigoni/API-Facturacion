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
