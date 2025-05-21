import { ArrowPathIcon, CpuChipIcon, SignalIcon } from '@heroicons/react/24/outline';

export default function PerformancePanel() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">System Performance</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4">
          <CpuChipIcon className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-200">1.2s</p>
          <p className="text-gray-400 text-sm">Avg. Response</p>
        </div>
        <div className="text-center p-4">
          <SignalIcon className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-200">427</p>
          <p className="text-gray-400 text-sm">Active Sessions</p>
        </div>
        <div className="text-center p-4">
          <ArrowPathIcon className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-200">Synced</p>
          <p className="text-gray-400 text-sm">Offline Status</p>
        </div>
      </div>
    </div>
  );
}