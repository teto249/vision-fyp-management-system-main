const { Sequelize } = require("sequelize");
const mysql = require('mysql2/promise');
require("dotenv").config();

const DB_NAME = process.env.DB_NAME || "vision-fyp-management-system";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";

// Create database if it doesn't exist
async function createDatabase() {
  try {
    // Create a temporary connection without database selection
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log("Database checked/created successfully");
    await connection.end();
  } catch (err) {
    console.error("Database creation failed:", err);
    process.exit(1);
  }
}

// Initialize Sequelize
const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
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


const connectDB = async () => {
  try {
    // First create database if it doesn't exist
    await createDatabase();

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
    const Project = require("../models/Project");

    // Import and initialize model associations
    require("../models/index");

    // Check if database is already initialized by looking for Institution table
    const [results] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = :schema AND table_name = 'Institutions'",
      {
        replacements: { schema: DB_NAME },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Only initialize if tables don't exist
    if (!results) {
      console.log("First time initialization - creating tables...");
      await sequelize.sync({ force: true });
      console.log("All tables created successfully");

      // Create default institution
      console.log("Creating default institution...");
      const institution = await Institution.create({
        shortName: "GreenTel Agriculture",
        fullName: "GreenTel For Agriculture and Technology",
        address: "Khartoum City, Sudan",
        email: "greentel@sudan.su",
        phone: "+1234567890",
        logoPath: "https://ui-avatars.com/api/?name=GA&size=256&background=random",
      });
      console.log("Default institution created:", institution.shortName);

      // Create default admin
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

      if (process.env.NODE_ENV === "development") {
        console.log("Default admin credentials:");
        console.log("Email:", newAdmin.email);
        console.log("Password: admin123");
      }
    } else {
      // If tables exist, just sync models without force
      await sequelize.sync();
      console.log("Database already initialized - syncing models only");
    }

    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    console.error("Error details:", error.stack);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
