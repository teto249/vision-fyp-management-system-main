const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Institution = sequelize.define("Institution", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  shortName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logoPath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Institution.beforeCreate((institution) => {
  institution.id = institution.shortName.toLowerCase().replace(/\s+/g, "");
});

module.exports = Institution;
