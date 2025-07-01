"use client";
import React, { useEffect, useState } from "react";
import { 
  PencilIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import { fetchUsersByUniversity, deleteUser } from "../../../api/uniAdmin/FetchUsers";

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
  supervisorId?: string;
  supervisorName?: string;
  role?: "Student";
}

// Supervisors Table Component
function SupervisorsTable({ 
  supervisors, 
  onDelete 
}: { 
  supervisors: Supervisor[]; 
  onDelete: (userId: string, fullName: string) => void;
}) {
  if (supervisors.length === 0) {
    return (
      <div className="p-12 text-center">
        <AcademicCapIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No Supervisors Found</h3>
        <p className="text-slate-400">No supervisors match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-800/50">
          <tr>
            <th className="p-4 text-left text-slate-300 font-semibold">Supervisor</th>
            <th className="p-4 text-left text-slate-300 font-semibold">Contact</th>
            <th className="p-4 text-left text-slate-300 font-semibold">Department</th>
            <th className="p-4 text-left text-slate-300 font-semibold">Office</th>
            <th className="p-4 text-left text-slate-300 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {supervisors.map((supervisor, index) => (
            <tr
              key={supervisor.userId}
              className="hover:bg-slate-700/30 transition-all duration-200 group"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {supervisor.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                      {supervisor.fullName}
                    </div>
                    <div className="text-sm text-slate-400">{supervisor.universityEmail}</div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <EnvelopeIcon className="w-4 h-4 text-teal-400" />
                  <span className="text-sm">{supervisor.contactEmail}</span>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800/50">
                  {supervisor.department}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <BuildingOfficeIcon className="w-4 h-4 text-teal-400" />
                  <span className="text-sm">{supervisor.officeAddress}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-slate-700/50 hover:bg-teal-600 text-slate-400 hover:text-white transition-all duration-200 group">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(supervisor.userId, supervisor.fullName)}
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-red-600 text-slate-400 hover:text-white transition-all duration-200 group"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Students Table Component
function StudentsTable({ 
  students, 
  supervisors, 
  onDelete 
}: { 
  students: Student[]; 
  supervisors: Supervisor[]; 
  onDelete: (userId: string, fullName: string) => void;
}) {
  // Function to get supervisor name by ID
  const getSupervisorName = (supervisorId?: string): string | null => {
    if (!supervisorId) return null;
    const supervisor = supervisors.find(sup => sup.userId === supervisorId);
    return supervisor ? supervisor.fullName : null;
  };

  if (students.length === 0) {
    return (
      <div className="p-12 text-center">
        <UserGroupIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No Students Found</h3>
        <p className="text-slate-400">No students match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-800/50">
          <tr>
            <th className="p-4 text-left text-slate-300 font-semibold">Student</th>
            <th className="p-4 text-left text-slate-300 font-semibold">Department</th>
            <th className="p-4 text-left text-slate-300 font-semibold">Level</th>
            <th className="p-4 text-left text-slate-300 font-semibold">Supervisor</th>
            <th className="p-4 text-left text-slate-300 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {students.map((student, index) => {
            const supervisorName = getSupervisorName(student.supervisorId) || student.supervisorName;
            
            return (
              <tr
                key={student.userId}
                className="hover:bg-slate-700/30 transition-all duration-200 group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                        {student.fullName}
                      </div>
                      <div className="text-sm text-slate-400">{student.universityEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-800/50">
                    {student.department}
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-900/30 text-orange-300 border border-orange-800/50">
                    {student.level}
                  </span>
                </td>
                <td className="p-4">
                  {supervisorName ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {supervisorName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        {supervisorName}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900/30 text-gray-400 border border-gray-700/50">
                      Not Assigned
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-slate-700/50 hover:bg-teal-600 text-slate-400 hover:text-white transition-all duration-200 group">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(student.userId, student.fullName)}
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-red-600 text-slate-400 hover:text-white transition-all duration-200 group"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function UserListPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredSupervisors, setFilteredSupervisors] = useState<Supervisor[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"supervisors" | "students">("supervisors");
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    userType: 'student' | 'supervisor';
  }>({
    isOpen: false,
    userId: '',
    userName: '',
    userType: 'student'
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Show notification function
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle delete user
  const handleDeleteUser = (userId: string, fullName: string, userType: 'student' | 'supervisor') => {
    setDeleteModal({
      isOpen: true,
      userId,
      userName: fullName,
      userType
    });
  };

  // Confirm delete user
  const confirmDeleteUser = async () => {
    try {
      setIsDeleting(true);
       await deleteUser(deleteModal.userId, deleteModal.userType);
      
      
      // Remove user from state
      if (deleteModal.userType === 'student') {
        setStudents(prev => prev.filter(student => student.userId !== deleteModal.userId));
      } else {
        setSupervisors(prev => prev.filter(supervisor => supervisor.userId !== deleteModal.userId));
      }
      
      showNotification('success', `${deleteModal.userName} has been deleted successfully`);
      setDeleteModal({ isOpen: false, userId: '', userName: '', userType: 'student' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete user";
      showNotification('error', `Failed to delete ${deleteModal.userName}: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, userId: '', userName: '', userType: 'student' });
  };



  // Filter users based on search term
  useEffect(() => {
    const filtered = supervisors.filter(supervisor =>
      supervisor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.universityEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSupervisors(filtered);
  }, [supervisors, searchTerm]);

  useEffect(() => {
    const filtered = students.filter(student => {
      // Get supervisor name by matching ID
      const supervisorName = supervisors.find(sup => sup.userId === student.supervisorId)?.fullName || student.supervisorName;
      
      return (
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.universityEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supervisorName && supervisorName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredStudents(filtered);
  }, [students, supervisors, searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        // Get admin info from localStorage
        const adminInfoString = localStorage.getItem("adminInfo");
        
        if (!adminInfoString) {
          throw new Error("University admin information not found. Please log in again.");
        }

        let adminInfo;
        try {
          adminInfo = JSON.parse(adminInfoString);
        } catch (parseError) {
          throw new Error("Invalid admin information format. Please log in again.");
        }
        
        // Try multiple ways to get the university ID
        const universityId = adminInfo?.universityId || 
                            adminInfo?.university?.id ||
                            adminInfo?.University?.id;
        
        if (!universityId) {
          console.error("Admin info structure:");
          throw new Error("University ID not found. Please ensure you are logged in as a university admin.");
        }

        showNotification('info', 'Loading users...');
     
        
        // Fetch users data
        const data = await fetchUsersByUniversity(universityId);
        setSupervisors(data.supervisors || []);
        setStudents(data.students || []);
        setError("");
        showNotification('success', `Loaded ${(data.supervisors?.length || 0) + (data.students?.length || 0)} users successfully`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch user data";
        setError(errorMessage);
        showNotification('error', `Failed to load users: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <Loader2 className="relative w-16 h-16 text-teal-400 animate-spin mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Loading Users</h2>
          <p className="text-slate-400">Fetching supervisors and students...</p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-900/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-red-300 mb-4">Unable to Load Users</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                     text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-red-500/25"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`p-4 rounded-xl shadow-2xl backdrop-blur-xl border max-w-sm
            ${notification.type === 'success' 
              ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300' 
              : notification.type === 'error'
              ? 'bg-red-900/20 border-red-500/30 text-red-300'
              : 'bg-blue-900/20 border-blue-500/30 text-blue-300'
            }`}>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl mb-6 shadow-2xl shadow-teal-500/25">
              <UserGroupIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
              User Management
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full mb-6" />
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Manage supervisors and students in your university
            </p>
          </div>

          {/* Search and Controls */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                />
              </div>
              
              {/* Tab Navigation */}
              <div className="flex bg-slate-800/50 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("supervisors")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === "supervisors"
                      ? "bg-teal-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <AcademicCapIcon className="w-4 h-4" />
                  Supervisors ({filteredSupervisors.length})
                </button>
                <button
                  onClick={() => setActiveTab("students")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === "students"
                      ? "bg-teal-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <UserGroupIcon className="w-4 h-4" />
                  Students ({filteredStudents.length})
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
            {activeTab === "supervisors" ? (
              <SupervisorsTable 
                supervisors={filteredSupervisors} 
                onDelete={(userId, fullName) => handleDeleteUser(userId, fullName, 'supervisor')}
              />
            ) : (
              <StudentsTable 
                students={filteredStudents} 
                supervisors={supervisors}
                onDelete={(userId, fullName) => handleDeleteUser(userId, fullName, 'student')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete {deleteModal.userType}</h3>
                <p className="text-slate-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-300">
                Are you sure you want to delete <span className="font-semibold text-white">{deleteModal.userName}</span>?
              </p>
              {deleteModal.userType === 'supervisor' && (
                <p className="text-sm text-amber-400 mt-2">
                  Note: Students assigned to this supervisor will be unassigned.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
