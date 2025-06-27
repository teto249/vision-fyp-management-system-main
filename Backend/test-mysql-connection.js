/**
 * XAMPP MySQL Connection Test Script
 * Run this independently to test your XAMPP MySQL setup
 * 
 * Usage: node test-mysql-connection.js
 */

const mysql = require('mysql2/promise');
require("dotenv").config();

const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";

async function testXAMPPConnection() {
  console.log("🔍 XAMPP MySQL Connection Test");
  console.log("================================");
  console.log(`Host: ${DB_HOST}`);
  console.log(`Port: ${DB_PORT}`);
  console.log(`User: ${DB_USER}`);
  console.log(`Password: ${DB_PASSWORD ? '[SET]' : '[EMPTY]'}`);
  console.log("================================\n");

  try {
    console.log("⏳ Attempting to connect to MySQL...");
    
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      connectTimeout: 5000
    });

    console.log("✅ Connection successful!");

    // Test basic operations
    console.log("⏳ Testing basic query...");
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time');
    console.log("✅ Query successful:", rows[0]);

    // Show databases
    console.log("⏳ Listing databases...");
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log("📊 Available databases:");
    databases.forEach(db => console.log(`   - ${db.Database}`));

    // Show MySQL version
    console.log("⏳ Getting MySQL version...");
    const [version] = await connection.execute('SELECT VERSION() as version');
    console.log("🔧 MySQL version:", version[0].version);

    await connection.end();
    console.log("\n🎉 All tests passed! XAMPP MySQL is working correctly.");
    
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    console.log("\n🔧 TROUBLESHOOTING STEPS:");
    
    if (error.code === 'ECONNREFUSED') {
      console.log("1. ❌ MySQL service is not running");
      console.log("   → Open XAMPP Control Panel");
      console.log("   → Click 'Start' next to MySQL");
      console.log("   → Wait for status to show 'Running'");
    } else if (error.code === 'ETIMEDOUT') {
      console.log("1. ⏰ Connection timed out");
      console.log("   → Check if MySQL is listening on port 3306");
      console.log("   → Verify firewall settings");
      console.log("   → Try restarting XAMPP MySQL service");
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("1. 🚫 Access denied");
      console.log("   → Check username and password");
      console.log("   → Default XAMPP MySQL user is 'root' with no password");
    } else {
      console.log("1. 🔍 Unknown error - check XAMPP logs");
    }
    
    console.log("\n💡 QUICK CHECKS:");
    console.log("   □ XAMPP Control Panel shows MySQL as 'Running'");
    console.log("   □ Can access http://localhost/phpmyadmin");
    console.log("   □ No other MySQL services running on port 3306");
    console.log("   □ Windows Firewall allows MySQL connections");
    
    process.exit(1);
  }
}

// Run the test
testXAMPPConnection();
