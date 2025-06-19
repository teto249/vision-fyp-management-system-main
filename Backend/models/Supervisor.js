const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Supervisor = sequelize.define("Supervisor", {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  
  },
  universityEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    // Optional during initial registration
  },
  address: {
    type: DataTypes.STRING,
  // Optional during initial registration
  },
  contactEmail: {
    type: DataTypes.STRING,
     // Optional during initial registration
  },
  officeAddress: {
    type: DataTypes.STRING,
   // Optional during initial registration
  },
  role: {
    type: DataTypes.ENUM("Supervisor"),
    allowNull: false,
    defaultValue: "Supervisor",
  },
  universityId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Universities",
      key: "id"  // Changed from universityId to match University model
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,  // Required during registration
  },
  requirePasswordChange: {
    type: DataTypes.BOOLEAN,
    defaultValue: true  // New supervisors will need to change password
  }
});

module.exports = Supervisor;