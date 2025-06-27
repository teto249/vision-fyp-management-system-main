const User = require("./user");
const University = require("./University");
const MainAdmin = require("./MainAdmin");
const Institution = require("./Institution");
const UniAdmin = require("./UniAdmin");
const Student = require("./Student");
const Supervisor = require("./Supervisor");
const Document = require("./Document");
const Project = require("./Project");
const Milestone = require("./Milestone");
const Task = require("./Task");
const Meeting = require("./Meeting");
const Feedback = require("./Feedback");

// Institution & MainAdmin associations
Institution.hasMany(MainAdmin, { as: "admins", foreignKey: "institutionId" });
MainAdmin.belongsTo(Institution, { foreignKey: "institutionId" });

// University & User associations
University.hasMany(User, {
  foreignKey: "universityId",
  onDelete: "CASCADE",
  as: "users",
});
User.belongsTo(University, {
  foreignKey: "universityId",
  as: "university",
});

// University & UniAdmin associations
University.hasMany(UniAdmin, {
  foreignKey: "universityId",
  as: "administrators",
});
UniAdmin.belongsTo(University, {
  foreignKey: "universityId",
  as: "university",
});

// User role-based associations
University.hasMany(User, {
  foreignKey: "universityId",
  scope: {
    role: "student",
  },
  as: "students",
});

University.hasMany(User, {
  foreignKey: "universityId",
  scope: {
    role: "supervisor",
  },
  as: "supervisors",
});

// University & Supervisor/Student associations
University.hasMany(Supervisor, {
  foreignKey: "universityId",
  onDelete: "CASCADE",
});
Supervisor.belongsTo(University, {
  foreignKey: "universityId",
});

University.hasMany(Student, {
  foreignKey: "universityId",
  onDelete: "CASCADE",
});
Student.belongsTo(University, {
  foreignKey: "universityId",
});

// Supervisor & Student associations
Supervisor.hasMany(Student, {
  foreignKey: "supervisorId",
  onDelete: "SET NULL",
});
Student.belongsTo(Supervisor, {
  foreignKey: "supervisorId",
});

// Document associations
Supervisor.hasMany(Document, {
  foreignKey: "supervisorId",
  onDelete: "CASCADE",
  as: "documents",
});
Document.belongsTo(Supervisor, {
  foreignKey: "supervisorId",
  as: "supervisor",
});

Student.hasMany(Document, {
  foreignKey: "studentId",
  onDelete: "CASCADE",
  as: "documents",
});
Document.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

// Project associations
Student.hasOne(Project, {
  foreignKey: "studentId",
  as: "project",
});
Project.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

Supervisor.hasMany(Project, {
  foreignKey: "supervisorId",
  onDelete: "CASCADE",
  as: "projects",
});
Project.belongsTo(Supervisor, {
  foreignKey: "supervisorId",
  as: "supervisor",
});

Project.belongsTo(University, {
  foreignKey: "universityId",
  as: "university",
});

Project.hasMany(Milestone, {
  foreignKey: "projectId",
  as: "milestones",
  onDelete: "CASCADE",
});
Milestone.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project",
});

// Milestone associations
Milestone.hasMany(Task, {
  foreignKey: "milestoneId",
  as: "tasks",
  onDelete: "CASCADE",
});
Task.belongsTo(Milestone, {
  foreignKey: "milestoneId",
  as: "milestone",
});

Milestone.hasMany(Meeting, {
  foreignKey: "milestoneId",
  as: "meetings",
  onDelete: "CASCADE",
});
Meeting.belongsTo(Milestone, {
  foreignKey: "milestoneId",
  as: "milestone",
});

Task.hasMany(Feedback, {
  foreignKey: "taskId",
  onDelete: "CASCADE",
  as: "feedback",
});

Feedback.belongsTo(Task, {
  foreignKey: "taskId",
  as: "task",
});

Supervisor.hasMany(Feedback, {
  foreignKey: "supervisorId",
  onDelete: "CASCADE",
  as: "feedbacks",
});

Feedback.belongsTo(Supervisor, {
  foreignKey: "supervisorId",
  as: "supervisor",
});

// Export all models
module.exports = {
  User,
  University,
  MainAdmin,
  Institution,
  UniAdmin,
  Project,
  Student,
  Supervisor,
  Document,
  Milestone,
  Task,
  Meeting,
  Feedback,
};
