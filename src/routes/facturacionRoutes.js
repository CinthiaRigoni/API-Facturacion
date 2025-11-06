const express = require('express');
const router = express.Router();
const facturacionController = require('../controllers/facturacionController');

router
<<<<<<< HEAD
    .post('/invoice', facturacionController.createInvoice)
    .get('/last-number', facturacionController.getLastInvoiceNumber);
=======

    .post('/generarComprobante', facturacionController.generarComprobante);
>>>>>>> b498e1ac6238fe41eb9c3c1cd9becdb4d3cffc67

module.exports = router;