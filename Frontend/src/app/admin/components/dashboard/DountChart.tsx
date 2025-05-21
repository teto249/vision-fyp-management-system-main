'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart() {
  const data = {
    labels: ['Used', 'Remaining'],
    datasets: [
      {
        data: [850, 150],
        backgroundColor: ['#1ABC9C', '#374151'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Capacity Overview</h3>
      <div className="h-64">
        <Doughnut 
          data={data} 
          options={{
            plugins: {
              legend: {
                labels: {
                  color: '#E5E7EB'
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}