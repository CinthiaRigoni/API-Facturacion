const Afip = require("@afipsdk/afip.js");

const generarComprobante = async (
    cuitCliente,
    ptoVenta,
    comprobante,
    concepto,
    tipoDoc,
    nroDoc,
    importeGravado,
    importeIva,
    importeExentoIva
) => {
    try {
        const afip = new Afip({ CUIT: cuitCliente });

        const lastVoucher = await afip.ElectronicBilling.getLastVoucher(
            ptoVenta,
            comprobante
        );
        const nroFactura = lastVoucher !== null ? lastVoucher + 1 : 1;

        const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0]
            .replace(/-/g, "");

        const data = {
            CantReg: 1,
            PtoVta: ptoVenta,
            CbteTipo: comprobante,
            Concepto: concepto,
            DocTipo: tipoDoc,
            DocNro: nroDoc,
            CbteDesde: nroFactura,
            CbteHasta: nroFactura,
            CbteFch: parseInt(fecha),
            ImpTotal: importeGravado + importeIva + importeExentoIva,
            ImpTotConc: 0,
            ImpNeto: importeGravado,
            ImpOpEx: importeExentoIva,
            ImpIVA: importeIva,
            ImpTrib: 0,
            MonId: "PES",
            MonCotiz: 1,
            Iva: [{ Id: 5, BaseImp: importeGravado, Importe: importeIva }],
        };

        const res = await afip.ElectronicBilling.createVoucher(data);

        const factura = await generarPDF(afip);

        return { cae: res.CAE, vencimiento: res.CAEFchVto, nroFactura, factura };

    } catch (error) {
        console.error('Error generating voucher:', error);
        throw error; // Esto permitirá que el controlador capture y maneje el error
    }

};
const generarPDF = async (afip) => {
    // Descargamos el HTML de ejemplo (ver mas arriba)
    // y lo guardamos como bill.html
    const html = require("fs").readFileSync("./bill.html", "utf8");

    // Nombre para el archivo (sin .pdf)
    const name = "PDF de prueba";

    // Opciones para el archivo
    const options = {
        width: 8, // Ancho de pagina en pulgadas. Usar 3.1 para ticket
        marginLeft: 0.4, // Margen izquierdo en pulgadas. Usar 0.1 para ticket
        marginRight: 0.4, // Margen derecho en pulgadas. Usar 0.1 para ticket
        marginTop: 0.4, // Margen superior en pulgadas. Usar 0.1 para ticket
        marginBottom: 0.4, // Margen inferior en pulgadas. Usar 0.1 para ticket
    };

    // Creamos el PDF
    const res = await afip.ElectronicBilling.createPDF({
        html: html,
        file_name: name,
        options: options,
    });
    // Mostramos la url del archivo creado
    console.log(res.file);

    return res.file;
};

module.exports = { generarComprobante };
