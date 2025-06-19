const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Milestone = sequelize.define('Milestone', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  },
  startDate: {
    type: DataTypes.DATE
  },
  endDate: {
    type: DataTypes.DATE
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id'
    }
  }
});


module.exports = Milestone;
