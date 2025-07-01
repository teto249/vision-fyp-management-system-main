// Test script for Student & Supervisor Registration with EmailJS
// Run this in the browser console to test the registration functions

const testStudentRegistration = async () => {
  try {
    console.log('🧪 Testing student registration...');
    
    const studentData = {
      fullName: 'John Doe Student',
      universityEmail: 'john.student@testuni.edu',
      phoneNumber: '+1234567890',
      address: '123 Student Street',
      idNumber: 'STU001',
      department: 'Computer Science',
      role: 'Student',
      level: 'PSM-1'
    };

    // Import the function
    const { registerSingleUser } = await import('./RegisterUniUsers');
    
    const result = await registerSingleUser(studentData);
    console.log('✅ Student registration test successful:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Student registration test failed:', error);
    throw error;
  }
};

const testSupervisorRegistration = async () => {
  try {
    console.log('🧪 Testing supervisor registration...');
    
    const supervisorData = {
      fullName: 'Dr. Jane Smith',
      universityEmail: 'jane.supervisor@testuni.edu',
      phoneNumber: '+1234567891',
      address: '456 Faculty Avenue',
      idNumber: 'SUP001',
      department: 'Computer Science',
      role: 'Supervisor',
      contactEmail: 'jane.contact@testuni.edu',
      officeAddress: 'Room 101, Faculty Building'
    };

    // Import the function
    const { registerSingleUser } = await import('./RegisterUniUsers');
    
    const result = await registerSingleUser(supervisorData);
    console.log('✅ Supervisor registration test successful:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Supervisor registration test failed:', error);
    throw error;
  }
};

const testBulkRegistration = async () => {
  try {
    console.log('🧪 Testing bulk registration...');
    
    const bulkData = [
      {
        fullName: 'Alice Student',
        universityEmail: 'alice@testuni.edu',
        phoneNumber: '+1111111111',
        address: '111 Alice Street',
        idNumber: 'STU002',
        department: 'Engineering',
        role: 'Student',
        level: 'PSM-2'
      },
      {
        fullName: 'Bob Supervisor',
        universityEmail: 'bob@testuni.edu',
        phoneNumber: '+2222222222',
        address: '222 Bob Avenue',
        idNumber: 'SUP002',
        department: 'Engineering',
        role: 'Supervisor',
        contactEmail: 'bob.contact@testuni.edu',
        officeAddress: 'Room 202, Engineering Building'
      }
    ];

    // Import the function
    const { registerBulkUsers } = await import('./RegisterUniUsers');
    
    const result = await registerBulkUsers(bulkData);
    console.log('✅ Bulk registration test successful:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Bulk registration test failed:', error);
    throw error;
  }
};

// Email template testing
const testEmailTemplates = () => {
  console.log('📧 Email Template Testing Guide:');
  
  console.log(`
  🎓 STUDENT TEMPLATE VARIABLES:
  - to_name: Student's full name
  - to_email: Student's university email
  - username: Generated username
  - password: Generated password
  - id_number: Student ID
  - department: Student's department
  - level: PSM-1 or PSM-2
  - university_name: University name
  - login_url: Login page URL
  
  👨‍🏫 SUPERVISOR TEMPLATE VARIABLES:
  - to_name: Supervisor's full name
  - to_email: Supervisor's university email
  - username: Generated username
  - password: Generated password
  - id_number: Staff ID
  - department: Supervisor's department
  - office_address: Office location
  - contact_email: Supervisor's contact email
  - university_name: University name
  - login_url: Login page URL
  
  📊 BULK SUMMARY TEMPLATE VARIABLES:
  - to_name: Admin's name
  - to_email: Admin's email
  - university_name: University name
  - total_registered: Number of successful registrations
  - total_failed: Number of failed registrations
  - success_list: Comma-separated list of successful users
  - failed_list: Comma-separated list of failed users
  - registration_date: Current date
  - admin_dashboard_url: Dashboard URL
  `);
};

// Export for use
export { 
  testStudentRegistration, 
  testSupervisorRegistration, 
  testBulkRegistration,
  testEmailTemplates 
};

// Usage examples:
console.log(`
🧪 TESTING COMMANDS:

1. Test student registration:
   testStudentRegistration().then(console.log).catch(console.error)

2. Test supervisor registration:
   testSupervisorRegistration().then(console.log).catch(console.error)

3. Test bulk registration:
   testBulkRegistration().then(console.log).catch(console.error)

4. View email template guide:
   testEmailTemplates()
`);
