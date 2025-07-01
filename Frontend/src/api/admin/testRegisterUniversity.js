// Test script for University Registration
// Run this in the browser console to test the registration function

const testUniversityRegistration = async () => {
  try {
    // Create test form data
    const testData = new FormData();
    testData.append('shortName', 'TEST');
    testData.append('fullName', 'Test University');
    testData.append('address', '123 Test Street, Test City');
    testData.append('email', 'test@testuni.edu');
    testData.append('phone', '+1234567890');
    testData.append('maxStudents', '1000');
    testData.append('maxSupervisors', '100');
    testData.append('adminFullName', 'Test Admin');
    testData.append('adminEmail', 'testadmin@testuni.edu');
    testData.append('adminPhone', '+1234567891');
    testData.append('adminPassword', 'TestAdmin123');

    console.log('🧪 Testing university registration...');
    
    // Import the function (adjust path as needed)
    const { registerUniversity } = await import('./registerUniversity');
    
    const result = await registerUniversity(testData);
    console.log('✅ Test successful:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
};

// Export for use
export { testUniversityRegistration };

// Usage in browser console:
// testUniversityRegistration().then(console.log).catch(console.error);
