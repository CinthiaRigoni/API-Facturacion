const Afip = require('@afipsdk/afip.js');

//Cuit del cliente, pto de venta, tipo de comprobante, concepto - Se envian desde el ENV
const generarComprobante = async (cuitCliente, ptoVenta, comprobante, concepto, tipoDoc, nroDoc, importeGravado, importeIva, importeExentoIva) => {
    try {
        const afip = new Afip({ CUIT: cuitCliente });
        console.log('AFIP instance created:', afip);

        const lastVoucher = await afip.ElectronicBilling.getLastVoucher(ptoVenta, comprobante);
        console.log('Last voucher:', lastVoucher);

        const nroFactura = lastVoucher !== null ? lastVoucher + 1 : 1;
        console.log('Numero de factura:', nroFactura);

        const fecha = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        console.log('Fecha:', fecha);

        const data = {
            'CantReg': 1, //Cantidad de facturas a registrar
            'PtoVta': ptoVenta,
            'CbteTipo': comprobante, //Tipo de factura
            'Concepto': concepto,
            'DocTipo': tipoDoc,
            'DocNro': nroDoc,
            'CbteDesde': nroFactura,
            'CbteHasta': nroFactura,
            'CbteFch': parseInt(fecha.replace(/-/g, '')),
            'ImpTotal': importeGravado + importeIva + importeExentoIva,
            'ImpTotConc': 0, // Importe neto no gravado
            'ImpNeto': importeGravado,
            'ImpOpEx': importeExentoIva,
            'ImpIVA': importeIva,
            'ImpTrib': 0, //Importe total de tributos
            'MonId': 'PES', //Tipo de moneda usada en la factura ('PES' = pesos argentinos) 
            'MonCotiz': 1, // Cotización de la moneda usada (1 para pesos argentinos)  
            'Iva': [ // Alícuotas asociadas a la factura
                {
                    'Id': 5, // Id del tipo de IVA (5 = 21%)
                    'BaseImp': importeGravado,
                    'Importe': importeIva
                }
            ]
        };
        console.log('Data to be sent:', data);

        //Creamos la factura
        const res = await afip.ElectronicBilling.createVoucher(data);

        //Mostramos respuesta de Afip
        console.log('Response from AFIP:', res);

        //Retornamos CAE y Vencimiento
        return { cae: res.CAE, vencimiento: res.CAEFchVto, nroFactura };

    } catch (error) {
        console.error('Error generating voucher:', error);
        throw error; // Esto permitirá que el controlador capture y maneje el error
    }
};


module.exports = { generarComprobante };
