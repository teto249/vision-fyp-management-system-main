import { UserGroupIcon } from "@heroicons/react/24/solid";

interface ProjectsHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  totalStudents: number;
}

export default function ProjectsHeader({
  filter,
  setFilter,
  totalStudents,
}: ProjectsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-100">Supervised Students</h1>
      <div className="flex items-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg border border-gray-700
                   focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="all">All Levels</option>
          <option value="PSM-1">PSM-1</option>
          <option value="PSM-2">PSM-2</option>
        </select>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
          <UserGroupIcon className="h-5 w-5 text-gray-400" />
          <span className="text-gray-200">{totalStudents} Students</span>
        </div>
      </div>
    </div>
  );
}
