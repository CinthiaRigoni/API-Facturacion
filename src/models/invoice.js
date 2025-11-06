const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  comprobante: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cae: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaVencimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  clienteEmail: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Invoice;