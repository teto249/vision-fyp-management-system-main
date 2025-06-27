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
    },    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileContent: {
      type: DataTypes.BLOB("long"),
      allowNull: true, // Make this optional for file-based storage
      get() {
        const rawValue = this.getDataValue('fileContent');
        return rawValue ? rawValue.toString('base64') : null;
      },
      set(value) {
        if (value && typeof value === 'string' && value.startsWith('data:')) {
          // Handle base64 string input
          const base64Data = value.split(';base64,').pop();
          this.setDataValue('fileContent', Buffer.from(base64Data, 'base64'));
        } else {
          this.setDataValue('fileContent', value);
        }
      }
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
