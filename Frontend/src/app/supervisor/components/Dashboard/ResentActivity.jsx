export default function RecentActivity() {
  return (
    <div className="bg-gray-700 shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-600 sm:px-6">
        <h3 className="text-lg font-medium text-gray-100">Recent Activity</h3>
      </div>
      <div className="p-6">
        <ul className="divide-y divide-gray-600">
          <li className="py-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-400/20 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-100">
                  Taylor Wilson submitted Final Presentation
                </p>
                <p className="text-sm text-gray-400">5 hours ago</p>
              </div>
            </div>
          </li>
          <li className="py-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-100">
                  Jamie Smith's Visualization Project is overdue
                </p>
                <p className="text-sm text-gray-400">1 day ago</p>
              </div>
            </div>
          </li>
          <li className="py-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-teal-400/20 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-teal-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-100">
                  Alex Johnson achieved 68% course progress
                </p>
                <p className="text-sm text-gray-400">2 days ago</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
