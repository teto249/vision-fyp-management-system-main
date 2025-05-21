const User = require("./user");
const University = require("./University");
const MainAdmin = require("./MainAdmin");
const Institution = require("./Institution");
const UniAdmin = require("./UniAdmin");
const Student = require("./Student");
const Supervisor = require("./Supervisor");

// Institution & MainAdmin associations
Institution.hasMany(MainAdmin, { as: "admins", foreignKey: "institutionId" });
MainAdmin.belongsTo(Institution, { foreignKey: "institutionId" });

// University & User associations
University.hasMany(User, {
  foreignKey: "universityId",
  onDelete: "CASCADE",
  as: "users"
});
User.belongsTo(University, {
  foreignKey: "universityId",
  as: "university"
});

// University & UniAdmin associations
University.hasMany(UniAdmin, {
  foreignKey: "universityId",
  as: "administrators"
});
UniAdmin.belongsTo(University, {
  foreignKey: "universityId",
  as: "university"
});

// User role-based associations
University.hasMany(User, {
  foreignKey: "universityId",
  scope: {
    role: "student"
  },
  as: "students"
});

University.hasMany(User, {
  foreignKey: "universityId",
  scope: {
    role: "supervisor"
  },
  as: "supervisors"
});

// University & Supervisor associations
University.hasMany(Supervisor, {
  foreignKey: "universityId",
  onDelete: "CASCADE"
});

Supervisor.belongsTo(University, {
  foreignKey: "universityId"
});

// University & Student associations
University.hasMany(Student, {
  foreignKey: "universityId",
  onDelete: "CASCADE"
});

Student.belongsTo(University, {
  foreignKey: "universityId"
});

// Supervisor & Student associations
Supervisor.hasMany(Student, {
  foreignKey: "supervisorId",
  onDelete: "SET NULL"
});

Student.belongsTo(Supervisor, {
  foreignKey: "supervisorId"
});

// Export all models
module.exports = {
  User,
  University,
  MainAdmin,
  Institution,
  UniAdmin,
  Student,
  Supervisor
};