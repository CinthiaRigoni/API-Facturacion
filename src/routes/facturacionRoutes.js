const express = require('express');
const router = express.Router();
const facturacionController = require('../controllers/facturacionController');

router

    .post('/generarComprobante', facturacionController.generarComprobante);

module.exports = router;