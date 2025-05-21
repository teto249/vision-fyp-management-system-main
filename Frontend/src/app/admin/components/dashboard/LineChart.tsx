'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Users',
        data: [650, 790, 820, 880, 910, 950],
        borderColor: '#1ABC9C',
        backgroundColor: 'rgba(26, 188, 156, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">User Growth</h3>
      <Line 
        data={data} 
        options={{ 
          responsive: true, 
          maintainAspectRatio: true,
          plugins: {
            legend: {
              labels: {
                color: '#E5E7EB'
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: '#374151'
              },
              ticks: {
                color: '#9CA3AF'
              }
            },
            y: {
              grid: {
                color: '#374151'
              },
              ticks: {
                color: '#9CA3AF'
              }
            }
          }
        }} 
      />
    </div>
  );
}