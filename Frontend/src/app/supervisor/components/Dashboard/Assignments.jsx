export default function Assignment(){
  return(<div className="bg-gray-700 shadow rounded-lg">
    <div className="px-4 py-5 border-b border-gray-600 sm:px-6 flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-100">
        All Assignments
      </h3>
      <button className="bg-teal-400 text-gray-900 px-4 py-2 rounded-md hover:bg-teal-500 font-medium transition-colors">
        Create Assignment
      </button>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          "Project Proposal",
          "Mid-term Report",
          "Final Presentation",
          "Data Analysis",
          "Visualization Project",
        ].map((assignment, index) => (
          <div
            key={index}
            className="border border-gray-600 bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-lg text-gray-100 mb-2">
              {assignment}
            </h4>
            <div className="text-sm text-gray-400 mb-4">
              Due:{" "}
              {
                ["Apr 15", "Mar 30", "May 10", "Apr 20", "Apr 5"][
                  index
                ]
              }
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-300">
                Completion Rate:
              </span>
              <span className="text-sm text-gray-400">
                {[100, 100, 33, 33, 0][index]}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-teal-400 h-2 rounded-full"
                style={{ width: `${[100, 100, 33, 33, 0][index]}%` }}
              ></div>
            </div>
            <div className="flex justify-end">
              <button className="text-teal-400 hover:text-teal-300 text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
}