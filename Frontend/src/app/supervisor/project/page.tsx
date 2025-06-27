"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupervisedStudents } from "../../../api/SupervisorApi/FetchProjects";
import {
  UserGroupIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import StudentCard from "../components/StudentProject/StuddentCard";
import ProjectsHeader from "../components/StudentProject/ProjectHeader";
import LoadingSpinner from "../components/Project/LoadingSpinner";
import EmptyState from "../components/Project/EmptyState";

import { useStudents } from "../store/StudentsContext";

export default function Projects() {
  const router = useRouter();
  const { students, setStudents } = useStudents();
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

    if (students.length === 0) {
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [router, setStudents, students.length]);

  const filteredStudents = students.filter((student) =>
    filter === "all" ? true : student.level === filter
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto py-5">
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
        <div className="space-y-4 rounded-xl bg-gray-900/30 p-6">
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
                router.push(`/supervisor/project/${student.userId}`)
              }
            />
          ))}

          {filteredStudents.length === 0 && (
            <EmptyState
              icon={UserGroupIcon}
              title="No Students Found"
              message={
                filter !== "all"
                  ? "Try changing the filter to see more students"
                  : "You haven't been assigned any students yet"
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
