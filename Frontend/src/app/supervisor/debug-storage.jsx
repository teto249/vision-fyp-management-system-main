'use client';
import { useEffect, useState } from 'react';

export default function DebugStorage() {
  const [storageData, setStorageData] = useState({});

  useEffect(() => {
    const checkStorage = () => {
      const data = {
        authToken: localStorage.getItem('authToken'),
        supervisorInfo: localStorage.getItem('supervisorInfo'),
        adminInfo: localStorage.getItem('adminInfo'),
        studentInfo: localStorage.getItem('studentInfo'),
      };
      
      // Parse JSON data
      Object.keys(data).forEach(key => {
        if (data[key] && key !== 'authToken') {
          try {
            data[key] = JSON.parse(data[key]);
          } catch (e) {
            data[key] = `Parse error: ${data[key]}`;
          }
        }
      });
      
      setStorageData(data);
    };

    checkStorage();
    
    // Check every 2 seconds
    const interval = setInterval(checkStorage, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">localStorage Debug</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(storageData, null, 2)}
      </pre>
    </div>
  );
}
