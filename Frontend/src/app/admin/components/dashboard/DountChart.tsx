'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data?: {
    capacityUsage: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

export default function DonutChart({ data }: DonutChartProps) {
  const used = data?.capacityUsage?.used || 850;
  const total = data?.capacityUsage?.total || 1000;
  const remaining = Math.max(0, total - used);

  const chartData = {
    labels: ['Used', 'Remaining'],
    datasets: [
      {
        data: [used, remaining],
        backgroundColor: ['#1ABC9C', '#374151'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Capacity Overview</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">
          <span className="block">Total Capacity: {total.toLocaleString()}</span>
          <span className="block">Used: {used.toLocaleString()} ({Math.round((used / total) * 100)}%)</span>
        </div>
      </div>
      <div className="h-64">
        <Doughnut 
          data={chartData} 
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