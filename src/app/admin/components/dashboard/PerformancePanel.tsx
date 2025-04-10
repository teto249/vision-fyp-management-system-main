// app/components/dashboard/PerformancePanel.tsx
import { ArrowPathIcon, CpuChipIcon, SignalIcon } from '@heroicons/react/24/outline';

export default function PerformancePanel() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-400">
      <h3 className="text-lg font-semibold mb-4">System Performance</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4">
          <CpuChipIcon className="h-8 w-8 text-teal-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold">1.2s</p>
          <p className="text-teal-700 text-sm">Avg. Response</p>
        </div>
        <div className="text-center p-4">
          <SignalIcon className="h-8 w-8 text-teal-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold">427</p>
          <p className="text-teal-700 text-sm">Active Sessions</p>
        </div>
        <div className="text-center p-4">
          <ArrowPathIcon className="h-8 w-8 text-teal-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold">Synced</p>
          <p className="text-teal-700 text-sm">Offline Status</p>
        </div>
      </div>
    </div>
  );
}