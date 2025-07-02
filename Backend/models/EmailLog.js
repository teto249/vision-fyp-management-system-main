const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmailLog = sequelize.define('EmailLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recipientEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  messageId: DataTypes.STRING,
  errorMessage: DataTypes.TEXT,
});

module.exports = EmailLog;
