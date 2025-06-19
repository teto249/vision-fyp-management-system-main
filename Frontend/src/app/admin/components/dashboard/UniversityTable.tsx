interface University {
  id: string;
  title: string;
  shortName: string;
  users: number;
  capacity: number;
  status: 'normal' | 'warning' | 'critical';
  adminDetails: {
    name: string;
    email: string;
  };
}

export default function UniversityTable({ data }: { data: University[] }) {
  const statusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'bg-status-warning';
      case 'critical': return 'bg-status-critical';
      default: return 'bg-status-success';
    }
  };
  console.log("University data:", data);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">University List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="pb-3 text-left">University</th>
                <th className="pb-3 text-left">Admin</th>
                <th className="pb-3 text-left">Capacity</th>
                <th className="pb-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {
              data.map((uni) => (
                <tr key={uni.id} className="border-b border-gray-700 last:border-b-0">
                  <td className="py-4">{uni.title}</td>
                  <td>{uni.adminDetails.name}</td>
                  <td>{uni.capacity}%</td>
                  <td>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${statusColor(uni.status)}`} />
                      {uni.status.charAt(0).toUpperCase() + uni.status.slice(1)}
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