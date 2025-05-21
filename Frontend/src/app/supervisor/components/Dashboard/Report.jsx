export default function Report() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="bg-gray-700 shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-600 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-100">
            Overall Progress
          </h3>
          <div className="flex items-center">
            <BarChart className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-400">Last 30 Days</span>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center bg-gray-800 rounded-md">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                Visualization placeholder
              </div>
              <div className="text-sm text-teal-400">
                Course progress chart would appear here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
