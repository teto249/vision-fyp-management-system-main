const mysql = require('mysql2/promise');
require("dotenv").config();

const DB_NAME = process.env.DB_NAME || "vision-fyp-management-system";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";

async function resetDatabase() {
  try {
    console.log("🔄 Connecting to MySQL...");
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD
    });

    console.log("🗑️  Dropping existing database...");
    await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
    
    console.log("🆕 Creating fresh database...");
    await connection.query(`CREATE DATABASE \`${DB_NAME}\``);
    
    await connection.end();
    
    console.log("✅ Database reset completed successfully!");
    console.log("💡 You can now restart your Node.js application");
    console.log("   The application will automatically create all tables and default data");
    
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    process.exit(1);
  }
}

resetDatabase();
