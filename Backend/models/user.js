const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  universityId: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null for users not tied to a university (e.g., Admins)
    references: {
      model: 'Universities',
      key: 'id'
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [8, 100]
    }
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
      notEmpty: { msg: "Contact email cannot be empty if provided" }
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: {
        args: [/^\+?[\d\s-]{8,20}$/],
        msg: "Phone number must be a valid format (e.g., +1234567890)"
      }
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: "Profile photo must be a valid URL" }
    }
  },
  role: {
    type: DataTypes.ENUM("admin", "supervisor", "student", "uniadmin"), // Lowercase to match index.js scopes
    allowNull: false,
    defaultValue: "admin",
  }
}, {
  tableName: 'Users',
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Instance method to validate password
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;