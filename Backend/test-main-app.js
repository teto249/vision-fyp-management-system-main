const express = require('express');

console.log('🚀 Testing main app startup...');

try {
  const app = require('./app.js');
  console.log('✅ Main app loaded successfully!');
  
  // Give it 3 seconds then exit for testing
  setTimeout(() => {
    console.log('🏁 App startup test completed successfully!');
    process.exit(0);
  }, 3000);
  
} catch (error) {
  console.error('❌ Error loading main app:', error.message);
  console.error('📍 Stack:', error.stack);
  process.exit(1);
}
