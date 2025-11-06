const express = require('express');
const router = express.Router();
const facturacionController = require('../controllers/facturacionController');

router
    .post('/invoice', facturacionController.createInvoice)
    .get('/last-number', facturacionController.getLastInvoiceNumber);

module.exports = router;