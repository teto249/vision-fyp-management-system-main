interface University {
  id: string;
  name: string; // Changed from title
  shortName: string;
  users: number;
  capacity: number;
  status: 'normal' | 'warning' | 'critical';
  maxStudents: number;
  maxSupervisors: number;
  currentStudents: number;
  currentSupervisors: number;
}

export default function UniversityTable({ data }: { data: University[] }) {
  const statusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'bg-status-warning';
      case 'critical': return 'bg-status-critical';
      default: return 'bg-status-success';
    }
  };

  // Handle empty or undefined data
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">University List</h3>
          <div className="text-center py-8">
            <p className="text-gray-400">No universities found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">University List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="pb-3 text-left">University</th>
                <th className="pb-3 text-left">Users</th>
                <th className="pb-3 text-left">Capacity</th>
                <th className="pb-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {data.map((uni) => (
                <tr key={uni.id} className="border-b border-gray-700 last:border-b-0">
                  <td className="py-4">
                    <div>
                      <div className="font-medium">{uni.name || 'Unknown University'}</div>
                      <div className="text-sm text-gray-500">{uni.shortName || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <div>{uni.users || 0} total</div>
                      <div className="text-gray-500">
                        {uni.currentStudents || 0}S / {uni.currentSupervisors || 0}T
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="font-medium">{uni.capacity || 0}%</div>
                      <div className="text-sm text-gray-500">
                        {uni.users || 0}/{(uni.maxStudents || 0) + (uni.maxSupervisors || 0)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${statusColor(uni.status || 'normal')}`} />
                      {(uni.status || 'normal').charAt(0).toUpperCase() + (uni.status || 'normal').slice(1)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}