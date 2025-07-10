const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const MainAdmin = sequelize.define("MainAdmin", {
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("MainAdmin"),
    allowNull: false,
    defaultValue: "MainAdmin",
  },
  institutionId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Institutions",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }
}, {
  tableName: 'MainAdmins',
  timestamps: true,
  hooks: {
    beforeSave: async (admin) => {
      if (admin.changed('password')) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    }
  }
});

// Instance method to check password
MainAdmin.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = MainAdmin;
