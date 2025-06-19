"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupervisedStudents } from "../../../api/SupervisorApi/FetchProjects";
import {
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import ProjectDetails from "../components/StudentProject/ProjectDetails";
import type { Student } from "../types/types";

interface ProjectsHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  totalStudents: number;
}

function ProjectsHeader({
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

interface StudentCardProps {
  student: Student;
  isExpanded: boolean;
  onToggle: () => void;
  onViewProject: () => void;
  onScheduleMeeting: () => void;
}

function StudentCard({
  student,
  isExpanded,
  onToggle,
  onViewProject,
}: StudentCardProps) {
  return (
    <div
      className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 
                   hover:border-teal-500/50 transition-all duration-300 overflow-hidden"
    >
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-100 mb-2">
              {student.fullName}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <AcademicCapIcon className="h-4 w-4" />
                {student.level}
              </span>
              <span className="flex items-center gap-1">
                <BuildingOfficeIcon className="h-4 w-4" />
                {student.department}
              </span>
            </div>
          </div>
          <ChevronDownIcon
            className={`h-6 w-6 text-gray-400 transition-transform duration-300
                      ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="p-6 pt-0 border-t border-gray-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-300">
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <a
                    href={`mailto:${student.universityEmail}`}
                    className="text-teal-500 hover:text-teal-400 transition-colors"
                  >
                    {student.universityEmail}
                  </a>
                </div>
                {student.phoneNumber && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <span>{student.phoneNumber}</span>
                  </div>
                )}
                {student.address && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <span>{student.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Project Details */}
            <div className="lg:col-span-2">
              <ProjectDetails project={student.project} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewProject();
              }}
              className="flex-1 py-2 px-4 bg-teal-600 hover:bg-teal-700 
                       text-white rounded-lg transition-colors duration-200"
            >
              View Project Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const result = await getSupervisedStudents();

        if (result.success && result.students) {
          setStudents(result.students);
        } else {
          setError(result.message || "Failed to fetch students");
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");

        if (
          error instanceof Error &&
          error.message?.includes("Authentication")
        ) {
          router.push("/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [router]);

  const filteredStudents = students.filter((student) =>
    filter === "all" ? true : student.level === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <ProjectsHeader
        filter={filter}
        setFilter={setFilter}
        totalStudents={students.length}
      />

      {error ? (
        <div className="text-center py-12 text-red-400">
          <ExclamationCircleIcon className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.userId}
              student={student}
              isExpanded={expandedId === student.userId}
              onToggle={() =>
                setExpandedId(
                  expandedId === student.userId ? null : student.userId
                )
              }
              onViewProject={() =>
                router.push(`/supervisor/students/${student.userId}/project`)
              }
              onScheduleMeeting={() =>
                router.push(`/supervisor/students/${student.userId}/meetings`)
              }
            />
          ))}

          {filteredStudents.length === 0 && (
            <div className="col-span-full text-center py-12">
              <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No Students Found
              </h3>
              <p className="text-gray-500">
                {filter !== "all"
                  ? "Try changing the filter to see more students"
                  : "You haven't been assigned any students yet"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
