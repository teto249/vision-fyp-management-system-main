const { Sequelize } = require("sequelize");
require("dotenv").config();

// AWS RDS MySQL Database Configuration
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT || 3306;

// Validate required environment variables
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  console.error('❌ Missing required database environment variables:');
  console.error('   DB_NAME:', DB_NAME ? '✅' : '❌ Missing');
  console.error('   DB_USER:', DB_USER ? '✅' : '❌ Missing');
  console.error('   DB_PASSWORD:', DB_PASSWORD ? '✅' : '❌ Missing');
  console.error('   DB_HOST:', DB_HOST ? '✅' : '❌ Missing');
  console.error('');
  console.error('💡 Please set up your .env file with AWS RDS credentials');
  process.exit(1);
}

console.log('🔧 AWS RDS Database Configuration:');
console.log(`   Host: ${DB_HOST}`);
console.log(`   Database: ${DB_NAME}`);
console.log(`   User: ${DB_USER}`);
console.log(`   Port: ${DB_PORT}`);
console.log('   SSL: Required (AWS RDS)');

// Initialize Sequelize for AWS RDS MySQL
console.log('☁️ Initializing AWS RDS MySQL connection...');
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 10,
    min: 2,
    acquire: 60000, // Maximum time to get connection from pool
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for AWS RDS
    },
    connectTimeout: 60000,
  },
  retry: {
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ESOCKETTIMEDOUT/,
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

const connectDB = async () => {
  try {
    console.log('📊 Connecting to AWS RDS MySQL database...');
    
    // Test database connection
    console.log('🔌 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ AWS RDS Database connection established');

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

      console.log('✅ Default data created successfully');
      console.log('🔑 Default admin credentials:');
      console.log('   Username: green-admin');
      console.log('   Password: admin123');
    } else {
      // Tables exist - just sync without force to update any schema changes
      console.log('🔄 Syncing existing database schema...');
      await sequelize.sync({ alter: false });
      console.log('✅ Database schema synchronized');
    }
  } catch (error) {
    console.error("❌ AWS RDS Database connection failed:", error.message);

    if (error.name === "SequelizeConnectionRefusedError") {
      console.error("💡 Connection refused - Check your AWS RDS configuration:");
      console.error("   1. Verify RDS instance is running and available");
      console.error("   2. Check security group allows connections on port 3306");
      console.error("   3. Ensure your IP is whitelisted or use 0.0.0.0/0 for testing");
      console.error("   4. Verify VPC settings allow public access");
    } else if (error.name === "SequelizeAccessDeniedError") {
      console.error("💡 Access denied - Check your credentials:");
      console.error("   1. Verify DB_USER and DB_PASSWORD in .env file");
      console.error("   2. Ensure the database user has proper permissions");
      console.error("   3. Check that the database name exists on RDS");
    } else if (error.name === "SequelizeHostNotFoundError") {
      console.error("💡 Host not found - Check your RDS endpoint:");
      console.error("   1. Verify DB_HOST in .env matches your RDS endpoint");
      console.error("   2. Ensure RDS instance is running");
      console.error("   3. Check AWS region settings");
    } else {
      console.error("📋 Full error details:", error.stack);
    }

    throw new Error(`AWS RDS Database connection failed: ${error.message}`);
  }
};

module.exports = { sequelize, connectDB };
