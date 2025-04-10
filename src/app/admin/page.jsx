// app/dashboard/page.tsx
import SummaryCard from './components/dashboard/SummaryCard';
import LineChart from './components/dashboard/LineChart';
import DonutChart from './components/dashboard/DountChart';
import UniversityTable from './components/dashboard/UniversityTable';
import PerformancePanel from './components/dashboard/PerformancePanel';

// Mock data - replace with real API calls
const mockUniversities = [
  { id: '1', name: 'University A', users: 250, capacity: 75, status: 'warning' },
  { id: '2', name: 'University B', users: 180, capacity: 60, status: 'normal' },
  { id: '3', name: 'University C', users: 420, capacity: 95, status: 'critical' },
];

export default function Dashboard() {
  return (
    <div className="p-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <SummaryCard title="Total Users" value={850} change={12} />
        <SummaryCard title="Total Universities" value={23} />
        <SummaryCard title="Capacity Usage" value="850/1,000" />
        <SummaryCard title="Active Projects" value={427} change={-2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LineChart />
        <DonutChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <UniversityTable data={mockUniversities} />
        <PerformancePanel />
      </div>
    </div>
  );
}