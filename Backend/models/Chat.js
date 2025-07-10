const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'userId'
    }
  },
  supervisorId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Supervisors',
      key: 'userId'
    }
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'chats',
  timestamps: true
});

module.exports = Chat;
