const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const UniAdmin = sequelize.define("UniAdmin", {
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  universityId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Universities',
      key: 'id'
    }
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  primaryEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^\+?[\d\s-]+$/
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'UniAdmin',
    allowNull: false
  },
  profilePhoto: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      is: {
        args: [/^data:image\/[a-z]+;base64,.+/],
        msg: "Profile photo must be a valid Data URL"
      }
    }
  }
}, {
  tableName: 'UniAdmins',
  timestamps: true,
  hooks: {
    beforeValidate: async (admin) => {
      if (!admin.username && admin.universityId && admin.fullName) {
        const firstName = admin.fullName.split(' ')[0];
        const shortName = admin.universityId.split('-')[0];
        admin.username = `${shortName}-${firstName.toUpperCase()}`;
      }
    },
    beforeSave: async (admin) => {
      if (admin.changed('password')) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    }
  }
});

UniAdmin.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = UniAdmin;