export default function StudentProgressTable({students, StatusIndicator}) {
  return (
    <div className="bg-gray-700 shadow rounded-lg mb-6">
      <div className="px-4 py-5 border-b border-gray-600 sm:px-6">
        <h3 className="text-lg font-medium text-gray-100">Student Progress</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Student
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Course
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Progress
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Response
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Last Active
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-600">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 font-medium">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {student.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusIndicator value={student.progress} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusIndicator value={student.attendance} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {student.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => viewStudentDetails(student)}
                    className="text-teal-400 hover:text-teal-300"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
