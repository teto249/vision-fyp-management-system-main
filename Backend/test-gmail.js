const emailService = require('./utils/emailService');
require('dotenv').config();

async function testGmailConfiguration() {
  
  // Check if Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return;
  }
  
  // Test admin credentials email
  try {
    const adminTestData = {
      email: process.env.GMAIL_USER, // Send to yourself for testing
      fullName: 'Test Admin',
      username: 'test_admin',
      password: 'temp_password_123',
      universityName: 'Test University'
    };
    
    const result = await emailService.sendAdminCredentials(adminTestData);
    
    if (result.success) {
      // Success
    } else {
      // Error
    }
  } catch (error) {
    // Error testing admin credentials email
  }
  
  // Test university registration email
  try {
    const universityTestData = {
      fullName: 'Test University of Technology',
      shortName: 'TUT',
      id: 'test-uni-001',
      address: '123 Education Street, Tech City, TC 12345',
      email: 'contact@testuni.edu',
      phone: '+1-555-0123',
      maxStudents: 500,
      maxSupervisors: 50
    };
    
    const adminTestData = {
      fullName: 'Dr. Jane Smith',
      username: 'jane.smith',
      temporaryPassword: 'TempPass123!',
      primaryEmail: process.env.GMAIL_USER // Send to yourself for testing
    };
    
    const result = await emailService.sendUniversityRegistrationEmail(universityTestData, adminTestData);
    
    if (result.success) {
      // Success
    } else {
      // Error
    }
  } catch (error) {
    // Error testing university registration email
  }
  
}

// Run the test
testGmailConfiguration().catch((error) => {});
