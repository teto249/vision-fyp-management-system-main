'use client';

import React, { useState, useEffect } from 'react';
import emailService from '../../lib/emailjs';

export default function EmailTestPage() {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check EmailJS configuration on component mount
    const checkConfig = () => {
      const config = {
        serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        studentTemplate: process.env.NEXT_PUBLIC_EMAILJS_STUDENT_TEMPLATE,
      };
      
      setTestResults(prev => ({
        ...prev,
        config: {
          serviceId: config.serviceId || 'NOT SET',
          publicKey: config.publicKey ? `${config.publicKey.substring(0, 8)}...` : 'NOT SET',
          studentTemplate: config.studentTemplate || 'NOT SET',
          isConfigured: !!(config.serviceId && config.publicKey && config.studentTemplate)
        }
      }));
    };
    
    checkConfig();
  }, []);

  const testEmailSending = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Starting email test...');
      
      // Test data based on the console output you shared
      const testUserData = {
        fullName: 'Altayeb Mustafa Ibrahim Abdelrasoul',
        universityEmail: 'utmaltayeb@gmail.com',
        role: 'Student',
        idNumber: 'A21EC9115',
        department: 'SECJ',
        level: 'PSM-1'
      };
      
      const testCredentials = {
        username: 'A21EC9115',
        password: 'SECJH42LEC9115',
        universityName: 'Test University'
      };
      
      console.log('📧 Sending test email with data:', { testUserData, testCredentials });
      
      const result = await emailService.sendUserRegistrationEmail(testUserData, testCredentials);
      
      setTestResults(prev => ({
        ...prev,
        emailTest: {
          success: true,
          result: result,
          timestamp: new Date().toLocaleString()
        }
      }));
      
      console.log('✅ Test email successful:', result);
      
    } catch (error) {
      console.error('❌ Test email failed:', error);
      
      setTestResults(prev => ({
        ...prev,
        emailTest: {
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleString()
        }
      }));
    }
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>📧 EmailJS Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>🔧 Configuration Status</h3>
        {testResults.config ? (
          <div>
            <p><strong>Service ID:</strong> {testResults.config.serviceId}</p>
            <p><strong>Public Key:</strong> {testResults.config.publicKey}</p>
            <p><strong>Student Template:</strong> {testResults.config.studentTemplate}</p>
            <p><strong>Is Configured:</strong> 
              <span style={{ color: testResults.config.isConfigured ? 'green' : 'red' }}>
                {testResults.config.isConfigured ? ' ✅ YES' : ' ❌ NO'}
              </span>
            </p>
          </div>
        ) : (
          <p>Loading configuration...</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testEmailSending}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: isLoading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? '🔄 Sending Test Email...' : '📤 Send Test Email'}
        </button>
      </div>

      {testResults.emailTest && (
        <div style={{ 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: testResults.emailTest.success ? '#f0f8f0' : '#fff0f0'
        }}>
          <h3>📧 Email Test Results</h3>
          <p><strong>Status:</strong> 
            <span style={{ color: testResults.emailTest.success ? 'green' : 'red' }}>
              {testResults.emailTest.success ? ' ✅ SUCCESS' : ' ❌ FAILED'}
            </span>
          </p>
          <p><strong>Timestamp:</strong> {testResults.emailTest.timestamp}</p>
          
          {testResults.emailTest.success ? (
            <div>
              <p><strong>Message ID:</strong> {testResults.emailTest.result.messageId}</p>
              <p><strong>Message:</strong> {testResults.emailTest.result.message}</p>
            </div>
          ) : (
            <div>
              <p><strong>Error:</strong> {testResults.emailTest.error}</p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>🔧 Troubleshooting Steps</h3>
        <ol>
          <li>Check if all environment variables are set in .env.local</li>
          <li>Verify EmailJS service is active and public key is correct</li>
          <li>Confirm template ID 'template_7h01cln' exists in your EmailJS account</li>
          <li>Check browser console for detailed error messages</li>
          <li>Verify EmailJS account has sufficient email credits</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e6f3ff', borderRadius: '8px' }}>
        <h3>📋 Expected Template Variables</h3>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`{
  to_email: "utmaltayeb@gmail.com",
  to_name: "Altayeb Mustafa Ibrahim Abdelrasoul",
  user_role: "Student",
  username: "A21EC9115",
  password: "SECJH42LEC9115",
  id_number: "A21EC9115",
  department: "SECJ",
  university_name: "Test University",
  login_url: "http://localhost:3001/auth/signin",
  contact_email: "support@vision-fyp.com",
  year: "2025",
  level: "PSM-1"
}`}
        </pre>
      </div>
    </div>
  );
}
