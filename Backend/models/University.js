const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
// Removed UniAdmin import since association is in index.js
const User = require("./user"); // Adjust path as needed, assumes User model with universityId and role


const University = sequelize.define("University", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  shortName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUppercase: true,
      len: [2, 10],
      notEmpty: true,
      notContains: [' ']
    }
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 500]
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
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^\+?[\d\s-]+$/,
      len: [8, 20]
    }
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000,
    validate: {
      min: 100,
      max: 50000,
      isInt: true
    }
  },
  maxSupervisors: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    validate: {
      min: 10,
      max: 1000,
      isInt: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000],
      isValidDescription(value) {
        if (value && value.length < 50) {
          throw new Error('Description must be at least 50 characters if provided');
        }
      }
    }
  },
  logoPath: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
      isImageUrl(value) {
        if (value && !value.match(/\.(jpg|jpeg|png|gif)$/i)) {
          throw new Error('Logo URL must point to an image file');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending', 'suspended'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  tableName: 'Universities',
  timestamps: true,
  hooks: {
    beforeValidate: (university) => {
      if (university.shortName) {
        university.shortName = university.shortName.toUpperCase().trim();
        university.id = university.shortName;
      }
      if (university.fullName) {
        university.fullName = university.fullName.trim();
      }
      if (university.email) {
        university.email = university.email.toLowerCase().trim();
      }
    },
    beforeCreate: (university) => {
      if (!university.logoPath) {
        university.logoPath = `https://ui-avatars.com/api/?name=${encodeURIComponent(university.shortName)}&size=256&background=random`;
      }
    }
  }
});

// Helper method for counting users (relies on associations defined in index.js)
University.prototype.countUsers = async function(options = {}) {
  return await User.count({
    where: {
      universityId: this.id,
      ...options.where,
    },
  });
};

// Instance methods (rely on countUsers and associations in index.js)
University.prototype.isAtCapacity = async function() {
  const studentCount = await this.countUsers({ where: { role: 'student' } });
  return studentCount >= this.maxStudents;
};

University.prototype.isSupervisorAtCapacity = async function() {
  const supervisorCount = await this.countUsers({ where: { role: 'supervisor' } });
  return supervisorCount >= this.maxSupervisors;
};

University.prototype.getStudentCount = async function() {
  return await this.countUsers({ where: { role: 'student' } });
};

University.prototype.getSupervisorCount = async function() {
  return await this.countUsers({ where: { role: 'supervisor' } });
};

// Static methods
University.findByShortName = async function(shortName) {
  // Note: UniAdmin association should be defined in index.js
  // For now, return basic university data without administrators
  return await this.findOne({
    where: { shortName: shortName.toUpperCase() }
  });
};

University.findActiveUniversities = async function() {
  return await this.findAll({
    where: { status: 'active' },
    attributes: ['id', 'shortName', 'fullName']
  });
};

module.exports = University;
