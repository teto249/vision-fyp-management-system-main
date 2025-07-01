/* eslint-disable @next/next/no-img-element */
// components/ui/Card.tsx

interface CardProps {
  id: string | number;
  title: string;
  description: string;
  image: string;
  location: string;
  students: number;
  capacity: number;
  status?: string;
  onView: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  viewMode?: "grid" | "list";
}

export default function Card({
  id,
  title,
  description,
  image,
  location,
  students,
  capacity,
  status = "active",
  onView,
  onDelete,
  viewMode = "grid",
}: CardProps) {
  const statusColor =
    capacity >= 90
      ? "bg-red-500"
      : capacity >= 75
      ? "bg-yellow-500"
      : "bg-green-500";

  const statusBgColor =
    capacity >= 90
      ? "bg-red-900/20 border-red-500/30"
      : capacity >= 75
      ? "bg-yellow-900/20 border-yellow-500/30"
      : "bg-green-900/20 border-green-500/30";

  const getStatusBadge = () => {
    const statusClasses: Record<string, string> = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      inactive: "bg-red-500/20 text-red-400 border-red-500/30", 
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses[status] || statusClasses.active}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleViewDetails = () => {
    onView(id);
  };

  if (viewMode === "list") {
    return (
      <div className="group bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-green-500/30">
        <div className="flex items-center space-x-6">
          {/* University Logo */}
          <div className="flex-shrink-0">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-700">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </div>

          {/* University Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-white truncate">
                  {title}
                </h3>
                {getStatusBadge()}
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </p>
            
            <p className="text-gray-300 text-sm mt-2 line-clamp-1">
              {description}
            </p>
          </div>

          {/* Statistics */}
          <div className="hidden sm:flex items-center space-x-8">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-400">
                {students.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Students</div>
            </div>

            <div className="text-center">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
                <span className="text-lg font-semibold text-white">{capacity}%</span>
              </div>
              <div className="text-xs text-gray-400">Capacity</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex space-x-2">
            <button
              onClick={handleViewDetails}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200 font-medium"
            >
              View Details
            </button>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200 font-medium"
                title="Delete University"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Statistics */}
        <div className="sm:hidden mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-sm font-semibold text-blue-400">
                {students.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Students</div>
            </div>

            <div className="text-center">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
                <span className="text-sm font-semibold text-white">{capacity}%</span>
              </div>
              <div className="text-xs text-gray-400">Capacity</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="group relative bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-green-500/30 hover:bg-gray-800/70">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        {getStatusBadge()}
      </div>

      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
        
        {/* Capacity indicator overlay */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBgColor}`}>
            {capacity}% Capacity
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-200 flex items-center">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{location}</span>
          </p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">{description}</p>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Students</span>
            <span className="font-medium text-blue-400">
              {students.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">System Load</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    capacity >= 90 ? "bg-red-500" : capacity >= 75 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(capacity, 100)}%` }}
                ></div>
              </div>
              <span className="font-medium text-white text-sm">{capacity}%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex space-x-2">
            <button
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={handleViewDetails}
            >
              View Details
            </button>
            {onDelete && (
              <button
                className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                title="Delete University"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
