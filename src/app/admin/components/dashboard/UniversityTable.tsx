// app/components/dashboard/UniversityTable.tsx
interface University {
  id: string;
  name: string;
  users: number;
  capacity: number;
  status: 'normal' | 'warning' | 'critical';
}

export default function UniversityTable({ data }: { data: University[] }) {
  const statusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-400 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">University List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-300  text-2xl border-b">
                <th className="pb-3 text-left ">University</th>
                <th className="pb-3 text-left">Users</th>
                <th className="pb-3 text-left">Capacity</th>
                <th className="pb-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((uni) => (
                <tr key={uni.id} className="border-b last:border-b-0">
                  <td className="py-4">{uni.name}</td>
                  <td>{uni.users}</td>
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