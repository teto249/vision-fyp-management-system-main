const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
require("dotenv").config();

// Database configuration with cloud support
const DB_NAME = process.env.DB_NAME || "vision-fyp-management-system";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;
const DATABASE_URL = process.env.DATABASE_URL; // For cloud databases
const DB_SSL = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

console.log('🔧 Database Configuration:');
console.log(`   Host: ${DB_HOST}`);
console.log(`   Database: ${DB_NAME}`);
console.log(`   User: ${DB_USER}`);
console.log(`   SSL: ${DB_SSL}`);
console.log(`   Environment: ${process.env.NODE_ENV}`);

// Create database if it doesn't exist (only for localhost)
async function createDatabase() {
  // Skip database creation for cloud databases
  if (DATABASE_URL || DB_HOST !== 'localhost') {
    console.log('☁️ Using cloud database - skipping database creation');
    return;
  }

  try {
    console.log('🔧 Attempting to create database if not exists...');
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
    console.log('✅ Database creation check completed');
  } catch (err) {
    console.error('❌ Database creation failed:', err.message);
    console.error('💡 This is normal if MySQL is not running or using cloud database');
    throw err;
  }
}


// Initialize Sequelize with cloud database support
let sequelize;

if (DATABASE_URL) {
  // Use DATABASE_URL for cloud databases (Aurora, PlanetScale, Railway, etc.)
  console.log('🌐 Using DATABASE_URL connection...');
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,          // Increased for Aurora
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: DB_SSL ? {
        require: true,
        rejectUnauthorized: false // For Aurora/cloud databases
      } : false,
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
    },
  });
} else {
  // Use individual connection parameters for Aurora/traditional setup
  console.log('🏠 Using individual connection parameters...');
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,          // Optimized for Aurora
      min: 2,           // Keep minimum connections for Aurora
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: DB_SSL ? {
        require: true,
        rejectUnauthorized: false
      } : false,
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
    },
    // Aurora-specific optimizations
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /ESOCKETTIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      max: 3
    }
  });
}

const connectDB = async () => {
  try {
    console.log('📊 Connecting to database...');
    
    // First create database if it doesn't exist
    await createDatabase();

    // Test database connection
    console.log('🔌 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Import all models BEFORE checking tables
    console.log('📋 Loading models...');
    const Institution = require("../models/Institution");
    const MainAdmin = require("../models/MainAdmin");
    const University = require("../models/University");
    const UniAdmin = require("../models/UniAdmin");
    const Supervisor = require("../models/Supervisor");
    const Student = require("../models/Student");
    const Project = require("../models/Project");

    // Import and initialize model associations
    require("../models/index");
    console.log('✅ Models loaded successfully');

    // Check if any tables exist in the database
    console.log('🔍 Checking database tables...');
    const [tableResults] = await sequelize.query(
      "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = :schema",
      {
        replacements: { schema: DB_NAME },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const tableCount = tableResults.table_count;
    console.log(`📊 Found ${tableCount} existing tables`);

    if (tableCount === 0) {
      // No tables exist - fresh installation
      console.log('🔨 Creating database tables (fresh installation)...');
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
    } else if (error.name === "SequelizeConnectionRefusedError") {
      console.error("💡 Connection refused - MySQL server is not running");
      console.error("   1. Start XAMPP or MySQL service");
      console.error("   2. Ensure MySQL is running on port 3306");
    } else {
      console.error("📋 Full error details:", error.stack);
    }

    // Throw error instead of process.exit to allow graceful handling
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

module.exports = { sequelize, connectDB };
