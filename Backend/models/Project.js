const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "In Progress", "Completed"),
    defaultValue: "Pending",
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  supervisorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  universityId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Project;