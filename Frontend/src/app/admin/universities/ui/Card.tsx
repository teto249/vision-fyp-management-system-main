// components/ui/Card.tsx
import Image from "next/image";

export default function Card({
  id,
  title,
  description,
  image,
  location,
  students,
  capacity,
  onView
}) {

  const statusColor =
    capacity >= 90
      ? "bg-red-900"
      : capacity >= 75
      ? "bg-orange-900"
      : "bg-green-900";
      
 const handleViewDetails = () => {
    onView(id)
  };



  return (
    <div className="group relative bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          height={200}
  width={200}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-200 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {location}
          </p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-300 mb-4 line-clamp-3">{description}</p>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Students</span>
            <span className="font-medium text-teal-600">
              {students.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Capacity</span>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${statusColor}`} />
              <span className="font-medium">{capacity}%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200" onClick={handleViewDetails}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
