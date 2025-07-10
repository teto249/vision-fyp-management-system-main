'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestConnection() {
  const [backendStatus, setBackendStatus] = useState<string>('Testing...');
  const [backendData, setBackendData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testBackendConnection = async () => {
    try {
      setBackendStatus('Testing connection...');
      setError('');
      
      const apiUrl =  'http://localhost:3000';
      console.log('Testing API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/api/auth/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setBackendData(data);
      setBackendStatus('✅ Connected Successfully!');
      
    } catch (err) {
      console.error('Backend connection error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setBackendStatus('❌ Connection Failed');
    }
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Frontend ↔ Backend Connection Test
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-lg mb-4">{backendStatus}</p>
          
          {error && (
            <div className="bg-red-600 p-4 rounded-lg mb-4">
              <h3 className="font-semibold">Error:</h3>
              <p>{error}</p>
            </div>
          )}
          
          {backendData && (
            <div className="bg-green-600 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Backend Response:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(backendData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Info</h2>
          <div className="space-y-2">
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
          </div>
        </div>

        <div className="text-center space-x-4">
          <button
            onClick={testBackendConnection}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Test Connection Again
          </button>
          
          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
