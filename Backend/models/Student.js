const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const Student = sequelize.define("Student", {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  fullName: {
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
  universityEmail: {
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
      len: [6, 100]
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^\+?[\d\s-]+$/
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 255]
    }
  },
  role: {
    type: DataTypes.ENUM("Student"),
    allowNull: false,
    defaultValue: "Student",
    validate: {
      isIn: [["Student"]]
    }
  },
  level: {
    type: DataTypes.ENUM("PSM-1", "PSM-2"),
    allowNull: false,
    validate: {
      isIn: [["PSM-1", "PSM-2"]]
    }
  },
  universityId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Universities",
      key: "id" // Changed from universityId to match University model
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  supervisorId: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: "Supervisors",
      key: "userId"
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  }
}, {
  tableName: 'Students',
  timestamps: true,
  hooks: {
    beforeSave: async (student) => {
      if (student.changed('password')) {
        student.password = await bcrypt.hash(student.password, 10);
      }
    }
  }
});

// Instance method to check password
Student.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Student;