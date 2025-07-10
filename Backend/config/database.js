const { Sequelize } = require("sequelize");
require("dotenv").config();

// Local MySQL Database Configuration
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT || 3306;
const DB_SSL = process.env.DB_SSL === "true";

// Validate required environment variables
if (!DB_NAME || !DB_USER || !DB_HOST) {
  console.log('❌ Missing database configuration in .env file');
  console.log('💡 Please set up DB_NAME, DB_USER, and DB_HOST');
  process.exit(1);
}

console.log('🔧 Local MySQL Database Configuration:');
console.log(`   Host: ${DB_HOST}`);
console.log(`   Database: ${DB_NAME}`);
console.log(`   User: ${DB_USER}`);
console.log(`   Port: ${DB_PORT}`);
console.log(`   SSL: ${DB_SSL ? 'Enabled' : 'Disabled'}`);

// Initialize Sequelize for Local MySQL (XAMPP)
console.log('🖥️ Initializing Local MySQL connection...');
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: DB_SSL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {},
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
    max: 2
  }
});

const connectDB = async () => {
  try {
    console.log('📊 Connecting to Local MySQL database...');
    
    // Test database connection
    console.log('🔌 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Local MySQL Database connection established');

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
      const newAdmin = await MainAdmin.create({
        username: "green-admin",
        name: "Altayeb Mustafa Ibrahim Abdelrasoul",
        email: "altayebnuba@gmail.com",
        password: "admin123", // Pass raw password - the model's beforeSave hook will hash it
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
    console.log("❌ Database connection failed");

    if (error.name === "SequelizeConnectionRefusedError") {
      console.log("💡 Please start MySQL service in XAMPP Control Panel");
    } else if (error.name === "SequelizeAccessDeniedError") {
      console.log("💡 Check MySQL credentials in .env file");
    } else if (error.name === "SequelizeDatabaseError" && error.message.includes("Unknown database")) {
      console.log("💡 Database will be created automatically once MySQL is running");
    } else {
      console.log("� Please ensure XAMPP MySQL is properly configured");
    }

    throw new Error("Database connection failed");
  }
};

module.exports = { sequelize, connectDB };
