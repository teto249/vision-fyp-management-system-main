"use client";
import React, { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { fetchUsersByUniversity } from "../../../api/uniAdmin/FetchUsers";

// Type Definitions
interface Supervisor {
  userId: string;
  fullName: string;
  universityEmail: string;
  department: string;
  contactEmail: string;
  officeAddress: string;
  role?: "Supervisor";
}

interface Student {
  userId: string;
  fullName: string;
  universityEmail: string;
  department: string;
  level: string;
  role?: "Student";
}

export default function UserListPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const userInfo = localStorage.getItem("userInfo");

  // Get universityId from admin info in localStorage

  const getUniversityId = () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
      if (!adminInfo || !adminInfo.universityId) {
        return null;
      }
      return adminInfo?.universityId; // Changed from university.id to universityId
    } catch (error) {
      console.error("Failed to parse uniAdmin info:", error);
      return null;
    }
  };
  console.log("University ID:", getUniversityId());

  useEffect(() => {
    const universityId = getUniversityId();
    if (!universityId) {
      setError("University ID not found");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUsersByUniversity(universityId);
        setSupervisors(data.supervisors || []);
        setStudents(data.students || []);
        setError("");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch user data"
        );
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-10 text-white">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-10">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-10">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">User Management</h1>

      {/* Supervisors Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-green-400">
            Supervisors ({supervisors.length})
          </h2>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="p-4 text-left text-gray-300">Full Name</th>
                <th className="p-4 text-left text-gray-300">Email</th>
                <th className="p-4 text-left text-gray-300">Department</th>
                <th className="p-4 text-left text-gray-300">Contact</th>
                <th className="p-4 text-left text-gray-300">Office</th>
                <th className="p-4 text-left text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {supervisors.map((sup) => (
                <tr
                  key={sup.userId}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="p-4 text-gray-200">{sup.fullName}</td>
                  <td className="p-4 text-gray-400">{sup.universityEmail}</td>
                  <td className="p-4 text-gray-200">{sup.department}</td>
                  <td className="p-4 text-gray-400">{sup.contactEmail}</td>
                  <td className="p-4 text-gray-400">{sup.officeAddress}</td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-green-400">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Students Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-green-400">
            Students ({students.length})
          </h2>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="p-4 text-left text-gray-300">Full Name</th>
                <th className="p-4 text-left text-gray-300">Email</th>
                <th className="p-4 text-left text-gray-300">Department</th>
                <th className="p-4 text-left text-gray-300">Level</th>
                <th className="p-4 text-left text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {students.map((student) => (
                <tr
                  key={student.userId}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="p-4 text-gray-200">{student.fullName}</td>
                  <td className="p-4 text-gray-400">
                    {student.universityEmail}
                  </td>
                  <td className="p-4 text-gray-200">{student.department}</td>
                  <td className="p-4 text-gray-400">{student.level}</td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-green-400">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
