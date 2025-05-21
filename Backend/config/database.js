const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "vision-fyp-management-system",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

// Add this before your connectDB function
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const connectDB = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("MySQL connected successfully");

    // Import all models
    const Institution = require("../models/Institution");
    const MainAdmin = require("../models/MainAdmin");
    const University = require("../models/University");
    const UniAdmin = require("../models/UniAdmin");
    const Supervisor = require("../models/Supervisor");
    const Student = require("../models/Student");

    // Define associations
    // MainAdmin - Institution relationship
    Institution.hasMany(MainAdmin, {
      foreignKey: "institutionId",
      onDelete: "CASCADE",
    });
    MainAdmin.belongsTo(Institution, {
      foreignKey: "institutionId",
    });

    // UniAdmin - University relationship (changed to one-to-one)
    University.hasOne(UniAdmin, {
      foreignKey: "universityId",
      onDelete: "CASCADE",
      unique: true, // Ensures one admin per university
    });
    UniAdmin.belongsTo(University, {
      foreignKey: "universityId",
    });

    // Supervisor - University relationship
    University.hasMany(Supervisor, {
      foreignKey: "universityId",
      onDelete: "CASCADE",
    });
    Supervisor.belongsTo(University, {
      foreignKey: "universityId",
    });

    // Student - University and Supervisor relationships
    University.hasMany(Student, {
      foreignKey: "universityId",
      onDelete: "CASCADE",
    });
    Student.belongsTo(University, {
      foreignKey: "universityId",
    });
    
    Supervisor.hasMany(Student, {
      foreignKey: "supervisorId",
      onDelete: "SET NULL",
    });
    Student.belongsTo(Supervisor, {
      foreignKey: "supervisorId",
    });

    // Sync only the required tables
    await sequelize.sync(); // or use { alter: true } for non-destructive changes

    // Create default institution if it doesn't exist
    let institution = await Institution.findOne();
    if (!institution) {
      console.log("Creating default institution...");
      institution = await Institution.create({
        shortName: "GreenTel Agriculture",
        fullName: "GreenTel For Agriculture and Technology",
        address: "Khartoum City, Sudan",
        email: "greentel@sudan.su",
        phone: "+1234567890",
        logoPath: "https://ui-avatars.com/api/?name=GA&size=256&background=random",
      });
      console.log("Default institution created:", institution.shortName);
    }

    // Create default admin if doesn't exist
    const adminExists = await MainAdmin.findOne({
      where: { email: "altayebnuba@gmail.com" },
    });

    if (!adminExists) {
      console.log("Creating default admin account...");
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const newAdmin = await MainAdmin.create({
        username: "green-admin",
        name: "Altayeb Mustafa Ibrahim Abdelrasoul",
        email: "altayebnuba@gmail.com",
        password: hashedPassword,
        contactEmail: "info@utm.my",
        phoneNumber: "0123456789",
        address: "43, Jalan Utama 38, Johor Bahru",
        role: "MainAdmin",
        profilePhoto: "https://ui-avatars.com/api/?name=AM&size=256&background=random",
        institutionId: institution.id,
      });

      console.log("Default admin created:", newAdmin.email);

      if (process.env.NODE_ENV === "development") {
        console.log("Default admin credentials:");
        console.log("Email:", newAdmin.email);
        console.log("Password: admin123");
      }
    }

    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
