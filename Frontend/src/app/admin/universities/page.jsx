"use client";
import { useEffect, useState } from "react";
import Card from "./ui/Card";
import { fetchUniversities } from "../../../api/admin/fetchUniversities";
import { useRouter } from "next/navigation"; // Add this import

export default function UniversityPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, inactive
  const router = useRouter();

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await fetchUniversities();
        setUniversities(data);
      } catch (err) {
        setError("Failed to load universities");
      } finally {
        setLoading(false);
      }
    };

    loadUniversities();
  }, []);

  // In your main universities page:
  const handleViewUniversity = (universityId) => {
    router.push(`/admin/universities/${universityId}`);
  };
  const filteredUniversities = universities
    .filter(
      (uni) =>
        uni.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.shortName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((uni) => (filter === "all" ? true : uni.status === filter));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-300 mb-3">
            Universities
          </h1>
          <div className="w-24 h-1.5 bg-teal-600 mx-auto rounded-full" />
          <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
            Explore partner universities and their current system utilization
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {filteredUniversities.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No universities found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredUniversities.map((uni) => (
              <Card
                key={uni.id}
                id={uni.id}
                title={uni.title}
                description={uni.description}
                image={uni.image}
                location={uni.location}
                students={uni.students}
                capacity={uni.capacity}
                status={uni.status}
                onView={handleViewUniversity}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
