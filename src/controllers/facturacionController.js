const facturacionServices = require('../services/facturacionServices')

const generarComprobante = async (req, res) => {
    try {
        const response = await facturacionServices.generarComprobante(
            req.body.cuitCliente,
            req.body.ptoVenta,
            req.body.comprobante,
            req.body.concepto,
            req.body.tipoDoc,
            req.body.nroDoc,
            req.body.importeGravado,
            req.body.importeIva,
            req.body.importeExentoIva
        );
        console.log(response)
        res.json(response);
    } catch (error) {
        console.log(error)
        res.status(500).send('Error al generar el comprobante');
    }
};

module.exports = { generarComprobante}