import { ArrowPathIcon, CpuChipIcon, SignalIcon } from '@heroicons/react/24/outline';

interface PerformancePanelProps {
  data?: {
    activeProjects: number;
    completedProjects: number;
    capacityUsage: {
      percentage: number;
    };
    recentActivity: Array<any>;
  };
}

export default function PerformancePanel({ data }: PerformancePanelProps) {
  const completionRate = data?.activeProjects && data?.completedProjects 
    ? Math.round((data.completedProjects / (data.activeProjects + data.completedProjects)) * 100)
    : 85;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">System Performance</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4">
          <CpuChipIcon className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-200">{data?.capacityUsage?.percentage || 0}%</p>
          <p className="text-gray-400 text-sm">System Load</p>
        </div>
        <div className="text-center p-4">
          <SignalIcon className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-200">{data?.activeProjects || 0}</p>
          <p className="text-gray-400 text-sm">Active Projects</p>
        </div>
        <div className="text-center p-4">
          <ArrowPathIcon className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-200">{completionRate}%</p>
          <p className="text-gray-400 text-sm">Completion Rate</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      {data?.recentActivity && data.recentActivity.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-md font-medium text-gray-300 mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {data.recentActivity.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-gray-400 flex-1">{activity.message}</span>
                <span className="text-gray-500 text-xs">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}