#!/usr/bin/env node

/**
 * Database Setup Script for Vision FYP Management System
 * This script helps you configure the database for deployment
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗄️  Vision FYP Database Setup Wizard\n');
console.log('This will help you configure your database for deployment.\n');

const databaseOptions = {
  '1': {
    name: 'PlanetScale (Recommended - Free)',
    description: 'MySQL-compatible, 5GB free tier, serverless',
    envTemplate: `# PlanetScale Database Configuration
DATABASE_URL=mysql://username:password@hostname:3306/database_name?ssl={"rejectUnauthorized":true}
DB_SSL=true
NODE_ENV=production`
  },
  '2': {
    name: 'Railway MySQL',
    description: 'Integrated with Railway hosting, $5/month',
    envTemplate: `# Railway MySQL Configuration  
DATABASE_URL=\${MYSQL_URL}
DB_HOST=\${MYSQL_HOST}
DB_NAME=\${MYSQL_DATABASE}
DB_USER=\${MYSQL_USERNAME}
DB_PASSWORD=\${MYSQL_PASSWORD}
DB_PORT=\${MYSQL_PORT}
DB_SSL=true
NODE_ENV=production`
  },
  '3': {
    name: 'AWS RDS',
    description: '20GB free tier for 12 months, production-ready',
    envTemplate: `# AWS RDS Configuration
DB_HOST=your-db.region.rds.amazonaws.com
DB_NAME=vision_fyp_db
DB_USER=admin
DB_PASSWORD=your-secure-password
DB_PORT=3306
DB_SSL=true
NODE_ENV=production`
  }
};

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('Select your database provider:\n');
  
  Object.entries(databaseOptions).forEach(([key, option]) => {
    console.log(`${key}. ${option.name}`);
    console.log(`   ${option.description}\n`);
  });

  const choice = await askQuestion('Enter your choice (1-3): ');
  
  if (!databaseOptions[choice]) {
    console.log('❌ Invalid choice. Please run the script again.');
    rl.close();
    return;
  }

  const selectedOption = databaseOptions[choice];
  console.log(`\n✅ You selected: ${selectedOption.name}\n`);

  // Generate environment file
  const envContent = `${selectedOption.envTemplate}

# Security Configuration
JWT_SECRET=replace-with-64-character-random-string
PORT=3000

# Frontend URL (update with your Vercel URL)
FRONTEND_URL=https://your-app.vercel.app

# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
`;

  // Write to .env.production file
  const envPath = path.join(__dirname, '.env.production');
  fs.writeFileSync(envPath, envContent);
  
  console.log('📝 Created .env.production file with your database configuration.');
  console.log('\n🔧 Next Steps:');
  console.log('1. Sign up for your chosen database service');
  console.log('2. Create a new database instance');
  console.log('3. Update the connection details in .env.production');
  console.log('4. Generate a secure JWT_SECRET');
  console.log('5. Test the connection locally');
  console.log('6. Deploy your application');
  
  console.log('\n📖 Detailed instructions available in DATABASE-DEPLOYMENT-GUIDE.md');
  
  rl.close();
}

main().catch(console.error);
