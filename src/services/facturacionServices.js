const Afip = require('@afipsdk/afip.js');
const nodemailer = require('nodemailer');
const Invoice = require('../models/invoice');
const DocumentService = require('./documentService');
require('dotenv').config();

class FacturacionService {
  constructor() {
    this.afip = new Afip({
      CUIT: process.env.CUIT,
      production: false,
      cert: 'cert.crt',
      key: 'key.key',
    });

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async getLastInvoiceNumber(puntoVenta = 1, tipoComprobante = 6) {
    try {
      return await this.afip.ElectronicBilling.getLastVoucher(puntoVenta, tipoComprobante);
    } catch (error) {
      console.error('Error getting last invoice number:', error);
      throw error;
    }
  }

  async createInvoice(invoiceData) {
    try {
      const lastNumber = await this.getLastInvoiceNumber();
      const date = new Date();

      const invoice = {
        'Cuit': 20111111112,
        'CantReg': 1,
        'PtoVta': 1,
        'CbteTipo': 6, //6 - Factura B y 3 - Factura A 
        'Concepto': 1, //1 - Productos y 2 - Servicios
        'DocTipo': 80, //80 - CUIT y 96 - DNI
        'DocNro': invoiceData.docNro,
        'CbteDesde': lastNumber + 1,
        'CbteHasta': lastNumber + 1,
        'CbteFch': parseInt(date.toISOString().slice(0,10).replace(/-/g, '')),
        'ImpTotal': invoiceData.total,
        'ImpTotConc': 0, // Total conceptos no gravados
        'ImpNeto': invoiceData.total,
        'ImpOpEx': 0,
        'ImpIVA': 0,
        'ImpTrib': 0,
        'MonId': 'PES',
        'MonCotiz': 1
      };

      const res = await this.afip.ElectronicBilling.createVoucher(invoice);

      // Generate PDF
      const pdfPath = await DocumentService.generatePDF({
        ...invoice,
        cae: res.CAE,
        clientData: invoiceData.clientData,
        items: invoiceData.items
      });

      // Save to database
      await Invoice.create({
        comprobante: `${invoice.CbteTipo}-${invoice.CbteDesde}`,
        cae: res.CAE,
        fechaVencimiento: res.CAEFchVto,
        total: invoiceData.total,
        clienteEmail: invoiceData.email,
        pdfPath: pdfPath
      });

      if (invoiceData.email) {
        await this.sendInvoiceByEmail(invoiceData.email, res.CAE, pdfPath);
      }

      return {
        ...res,
        pdfPath
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async sendInvoiceByEmail(email, cae, pdfPath) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Su factura electrónica',
        text: `Su factura ha sido generada con CAE: ${cae}`,
        attachments: [{
          filename: 'factura.pdf',
          path: pdfPath
        }]
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

module.exports = new FacturacionService();

{
  "docNro"; "20111111112",
  "total"; 100.00,
  "email"; "client@example.com",
  "clientData"; {
    "name"; "John Doe",
    "address"; "123 Main St"
  };
  "items"; [
    {
      "description": "Product 1",
      "quantity": 1,
      "price": 100.00
    }
  ]
}
