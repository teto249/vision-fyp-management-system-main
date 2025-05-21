"use client";
import { useEffect, useState } from "react";
import Card from "./ui/Card";
import { fetchAllUniversities } from "@/api/admin/university";

export default function UniversityPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await fetchAllUniversities();
        setUniversities(data);
      } catch (err) {
        setError("Failed to load universities");
      } finally {
        setLoading(false);
      }
    };

    loadUniversities();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full px-4 sm:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-300 mb-3">Universities</h1>
          <div className="w-24 h-1.5 bg-teal-600 mx-auto rounded-full" />
          <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
            Explore partner universities and their current system utilization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {universities.map((uni, index) => (
            <Card
              key={uni.id || index}
              title={uni.title}
              description={uni.description}
              image={uni.image}
              location={uni.location}
              students={uni.students}
              capacity={uni.capacity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}