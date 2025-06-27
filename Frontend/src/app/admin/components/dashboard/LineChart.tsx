'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
  data?: {
    totalUsers: number;
    totalStudents: number;
    totalSupervisors: number;
    activeProjects: number;
  };
}

export default function LineChart({ data }: LineChartProps) {
  // Generate mock trend data based on current values
  const generateTrendData = (currentValue: number, months: number = 6) => {
    const trend = [];
    const variance = 0.2; // 20% variance
    for (let i = months - 1; i >= 0; i--) {
      const factor = 0.8 + (0.4 * (months - i) / months); // Growth trend
      const noise = 1 + (Math.random() - 0.5) * variance;
      trend.push(Math.floor(currentValue * factor * noise));
    }
    return trend;
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Users',
        data: generateTrendData(data?.totalUsers || 850),
        borderColor: '#1ABC9C',
        backgroundColor: 'rgba(26, 188, 156, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Active Projects',
        data: generateTrendData(data?.activeProjects || 427),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Growth Trends</h3>
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="text-gray-400">
          <span className="block">Current Users: {data?.totalUsers?.toLocaleString() || 'Loading...'}</span>
          <span className="block">Active Projects: {data?.activeProjects?.toLocaleString() || 'Loading...'}</span>
        </div>
        <div className="text-gray-400">
          <span className="block">Students: {data?.totalStudents?.toLocaleString() || 'Loading...'}</span>
          <span className="block">Supervisors: {data?.totalSupervisors?.toLocaleString() || 'Loading...'}</span>
        </div>
      </div>
      <Line 
        data={chartData} 
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