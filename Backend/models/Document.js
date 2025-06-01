const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Document = sequelize.define(
  "Document",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileContent: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supervisorId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    tableName: "documents",
  }
);

module.exports = Document;
