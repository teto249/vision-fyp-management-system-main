const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Feedback = sequelize.define("Feedback", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Tasks",
      key: "id",
    },
  },  supervisorId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Supervisors",
      key: "userId",
    },
  },
});


module.exports = Feedback;
