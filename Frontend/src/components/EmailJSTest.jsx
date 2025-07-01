'use client';

import { useState } from 'react';
import emailService from '@/lib/emailjs';

export default function EmailJSTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testUserEmail = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const testUserData = {
        fullName: 'John Doe',
        universityEmail: 'john.doe@university.edu',
        idNumber: 'STU123456',
        department: 'Computer Science',
        role: 'Student',
        level: 'PSM-1'
      };

      const testCredentials = {
        username: 'john_doe_stu123456',
        password: 'TempPass123!',
        universityName: 'Test University'
      };

      const emailResult = await emailService.sendUserRegistrationEmail(
        testUserData,
        testCredentials
      );

      setResult(emailResult);
      console.log('Test email result:', emailResult);
    } catch (err) {
      setError(err.message);
      console.error('Test email error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const testBulkSummary = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const summaryData = {
        successCount: 5,
        failedCount: 2,
        successList: ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown', 'Charlie Davis'],
        failedList: ['Failed User 1', 'Failed User 2']
      };

      const emailResult = await emailService.sendBulkNotificationEmail(summaryData);
      setResult(emailResult);
      console.log('Bulk summary email result:', emailResult);
    } catch (err) {
      setError(err.message);
      console.error('Bulk summary email error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">EmailJS Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testUserEmail}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          {isLoading ? 'Sending...' : 'Test User Registration Email'}
        </button>

        <button
          onClick={testBulkSummary}
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          {isLoading ? 'Sending...' : 'Test Bulk Summary Email'}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-bold">Success!</h3>
          <p>Message: {result.message}</p>
          <p>ID: {result.messageId}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error!</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="mt-6 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
        <h3 className="font-bold">Instructions:</h3>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Set up EmailJS account and get your credentials</li>
          <li>Update environment variables in .env.local</li>
          <li>Create templates in EmailJS dashboard</li>
          <li>Test emails will be sent to configured addresses</li>
        </ol>
      </div>
    </div>
  );
}
