const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
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
      password: DB_PASSWORD,
    });
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
  } catch (err) {
    process.exit(1);
  }
}

// Initialize Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
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
});

const connectDB = async () => {
  try {
    // First create database if it doesn't exist
    await createDatabase();

    // Test database connection
    await sequelize.authenticate();

    // Import all models BEFORE checking tables
    const Institution = require("../models/Institution");
    const MainAdmin = require("../models/MainAdmin");
    const University = require("../models/University");
    const UniAdmin = require("../models/UniAdmin");
    const Supervisor = require("../models/Supervisor");
    const Student = require("../models/Student");
    const Project = require("../models/Project");

    // Import and initialize model associations
    require("../models/index");

    // Check if any tables exist in the database
    const [tableResults] = await sequelize.query(
      "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = :schema",
      {
        replacements: { schema: DB_NAME },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const tableCount = tableResults.table_count;

    if (tableCount === 0) {
      // No tables exist - fresh installation
      await sequelize.sync({ force: true });

      // Create default institution
      const institution = await Institution.create({
        shortName: "GreenTel Agriculture",
        fullName: "GreenTel For Agriculture and Technology",
        address: "Khartoum City, Sudan",
        email: "greentel@sudan.su",
        phone: "+1234567890",
        logoPath:
          "https://ui-avatars.com/api/?name=GA&size=256&background=random",
      });

      // Create default admin
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
        profilePhoto:
          "https://ui-avatars.com/api/?name=AM&size=256&background=random",
        institutionId: institution.id,
      });

      if (process.env.NODE_ENV === "development") {
        // Development mode credentials displayed
      }
    } else {
      // Tables exist - just sync without force to update any schema changes

      await sequelize.sync({ alter: false });
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);

    if (error.name === "SequelizeDatabaseError") {
      console.error("💡 Database Error Details:");
      console.error("   SQL Error:", error.parent?.sqlMessage || error.message);
      console.error("   Error Code:", error.parent?.errno);
      console.error("   SQL State:", error.parent?.sqlState);

      if (error.parent?.errno === 1932) {
        console.error("🔧 Fix: This error suggests table structure mismatch.");
        console.error(
          "   Try dropping the database and restarting the application:"
        );
        console.error("   1. Open phpMyAdmin (http://localhost/phpmyadmin)");
        console.error("   2. Drop the 'vision-fyp-management-system' database");
        console.error("   3. Restart the Node.js application");
      }
    } else {
      console.error("📋 Full error details:", error.stack);
    }

    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
