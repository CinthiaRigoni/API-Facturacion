const fs = require('fs').promises;
const path = require('path');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');

class DocumentService {
  constructor() {
    this.templatePath = path.join(__dirname, '../../bill.html');
    this.outputDir = path.join(__dirname, '../../temp');
  }

  async generatePDF(invoiceData) {
    try {
      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true });

      // Read and compile template
      const template = await fs.readFile(this.templatePath, 'utf8');
      const compiledTemplate = Handlebars.compile(template);

      // Prepare data for template
      const htmlContent = compiledTemplate({
        invoiceNumber: invoiceData.CbteDesde,
        date: new Date().toLocaleDateString(),
        total: invoiceData.ImpTotal,
        cae: invoiceData.cae,
        clientData: invoiceData.clientData,
        items: invoiceData.items
      });

      // Generate PDF using puppeteer
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      await page.setContent(htmlContent);

      const pdfPath = path.join(this.outputDir, `factura-${invoiceData.CbteDesde}.pdf`);
      
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: {
          top: '1cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm'
        }
      });

      await browser.close();
      return pdfPath;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}

module.exports = new DocumentService();