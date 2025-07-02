const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Task = sequelize.define("Task", {
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
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("Pending", "In Progress", "Completed"),
    defaultValue: "Pending"
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  milestoneId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Milestones',
      key: 'id'
    }
  }
});

module.exports = Task;
