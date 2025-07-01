"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchUniversityById, fetchUniversityStatistics, fetchUniversityMembers, deleteUniversity, forceDeleteUniversity } from "../../../../api/admin/fetchUniversities";
import type { UniversityDetail, UniversityStatistics, UniversityMembers, UniversityMember, DeleteUniversityResponse } from "../../../../api/admin/fetchUniversities";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  joinedAt: string;
}

export default function UniversityViewPage() {
  const params = useParams();
  const router = useRouter();
  const [universityData, setUniversityData] = useState<UniversityDetail | null>(null);
  const [stats, setStats] = useState<UniversityStatistics | null>(null);
  const [members, setMembers] = useState<UniversityMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForceDeleteModal, setShowForceDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const loadUniversityData = async () => {
      try {
        const [universityDetails, universityStats, universityMembers] = await Promise.all([
          fetchUniversityById(params.id as string),
          fetchUniversityStatistics(params.id as string),
          fetchUniversityMembers(params.id as string, 'all', 1, 10)
        ]);
        
        setUniversityData(universityDetails);
        setStats(universityStats);
        setMembers(universityMembers);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch university data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadUniversityData();
    }
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return "text-red-400";
    if (rate >= 75) return "text-yellow-400";
    return "text-green-400";
  };

  const handleDeleteUniversity = async () => {
    if (!universityData) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await deleteUniversity(universityData.id);
      
      // Show success message and redirect
      alert(`University "${response.deletedUniversity?.name}" has been successfully deleted.`);
      router.push('/admin/universities');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete university';
      console.error('Detail page delete error:', error);
      console.error('Error message:', errorMessage);
      setDeleteError(errorMessage);
      
      // If the error indicates there are active users, show force delete option
      if (errorMessage.includes('Cannot delete university with active users')) {
        setShowDeleteModal(false);
        setShowForceDeleteModal(true);
      } 
    } finally {
      setIsDeleting(false);
    }
  };

  const handleForceDeleteUniversity = async () => {
    if (!universityData) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await forceDeleteUniversity(universityData.id, true);
      
      // Show success message with details and redirect
      const deletedData = response.deletedData;
      if (deletedData) {
        alert(`University "${deletedData.university}" and all related data have been permanently deleted:\n` +
              `- ${deletedData.students} students\n` +
              `- ${deletedData.supervisors} supervisors\n` +
              `- ${deletedData.administrators} administrators\n` +
              `- ${deletedData.projects} projects`);
      } else {
        alert(`University has been successfully deleted.`);
      }
      
      router.push('/admin/universities');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to force delete university';
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading university data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-400">Error</h3>
          </div>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!universityData || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5.657-2.343m0 0L9 21l3-3 3 3-2.657-2.657z" />
          </svg>
          <p className="text-gray-400 text-lg">No university data found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Universities</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(universityData.status)}`}></div>
              <span className="text-gray-300 capitalize">{universityData.status || 'Active'}</span>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-6">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete University</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{universityData.name}</h1>
            <p className="text-xl text-gray-400 mb-4">{universityData.shortName}</p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Students</p>
                <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                <p className="text-xs text-gray-500">of {universityData.maxStudents} max</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.totalStudents / universityData.maxStudents) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Supervisors</p>
                <p className="text-2xl font-bold text-white">{stats.totalSupervisors}</p>
                <p className="text-xs text-gray-500">of {universityData.maxSupervisors} max</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.totalSupervisors / universityData.maxSupervisors) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Projects</p>
                <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
                <p className="text-xs text-green-400">+{Math.floor(stats.activeProjects * 0.1)} this month</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5.657-2.343m0 0L9 21l3-3 3 3-2.657-2.657z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Utilization Rate</p>
                <p className={`text-2xl font-bold ${getUtilizationColor(stats.utilizationRate)}`}>
                  {stats.utilizationRate}%
                </p>
                <p className="text-xs text-gray-500">System capacity</p>
              </div>
              <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg border border-gray-700/50">
            {[
              { id: "overview", label: "Overview", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
              { id: "details", label: "Details", icon: "M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5.657-2.343m0 0L9 21l3-3 3 3-2.657-2.657z" },
              { id: "members", label: "Members", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
              {/* Quick Info Card */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{universityData.address}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Contact Email:</span>
                    <span className="text-white">{universityData.contactEmail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{universityData.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Admin:</span>
                    <span className="text-white">{universityData.adminDetails?.name}</span>
                  </div>
                </div>
              </div>

              {/* Capacity Analysis */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Capacity Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Student Capacity</span>
                      <span className="text-white">{Math.round((stats.totalStudents / universityData.maxStudents) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.totalStudents / universityData.maxStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Supervisor Capacity</span>
                      <span className="text-white">{Math.round((stats.totalSupervisors / universityData.maxSupervisors) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.totalSupervisors / universityData.maxSupervisors) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="animate-fadeIn">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="p-6 border-b border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white">University Details</h3>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* University Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Short Name</label>
                      <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                        {universityData.shortName}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                      <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                        {universityData.name}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                    <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                      {universityData.address}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200 min-h-[80px]">
                      {universityData.description || "No description available"}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
                      <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                        {universityData.contactEmail}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                      <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                        {universityData.phone}
                      </div>
                    </div>
                  </div>

                  {/* System Capacity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Maximum Students</label>
                      <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                        {universityData.maxStudents.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Maximum Supervisors</label>
                      <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                        {universityData.maxSupervisors.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Administrator Details */}
                  <div className="border-t border-gray-700/50 pt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Administrator Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                        <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                          {universityData.adminDetails?.name || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                          {universityData.adminDetails?.email || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                        <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                          {universityData.adminDetails?.phone || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                        <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200">
                          {universityData.adminDetails?.username || "Not specified"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="animate-fadeIn">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="p-6 border-b border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white">University Members</h3>
                  <p className="text-gray-400 mt-1">Manage students, supervisors, and administrative staff</p>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* University Administrators */}
                  {members?.admins && members.admins.data.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">University Administrators</h4>
                      <div className="space-y-3">
                        {members.admins.data.map((admin) => (
                          <div key={admin.id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <span className="text-purple-400 font-semibold">
                                {admin.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-white">{admin.name}</h5>
                              <p className="text-sm text-gray-400">{admin.email}</p>
                              {admin.phone && <p className="text-sm text-gray-500">{admin.phone}</p>}
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                University Administrator
                              </span>
                              {admin.department && (
                                <p className="text-xs text-gray-500 mt-1">{admin.department}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Supervisors */}
                  {members?.supervisors && members.supervisors.data.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Supervisors</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {members.supervisors.data.map((supervisor) => (
                          <div key={supervisor.id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                              <span className="text-green-400 font-semibold">
                                {supervisor.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-white">{supervisor.name}</h5>
                              <p className="text-sm text-gray-400">{supervisor.universityEmail || supervisor.email}</p>
                              {supervisor.phone && <p className="text-sm text-gray-500">{supervisor.phone}</p>}
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Supervisor
                              </span>
                              {supervisor.department && (
                                <p className="text-xs text-gray-500 mt-1">{supervisor.department}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Students */}
                  {members?.students && members.students.data.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Students</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {members.students.data.map((student) => (
                          <div key={student.id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                              <span className="text-blue-400 font-semibold">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-white">{student.name}</h5>
                              <p className="text-sm text-gray-400">{student.universityEmail || student.email}</p>
                              {student.phone && <p className="text-sm text-gray-500">{student.phone}</p>}
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {student.level || 'Student'}
                              </span>
                              {student.department && (
                                <p className="text-xs text-gray-500 mt-1">{student.department}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {(!members || 
                    ((!members.admins || members.admins.data.length === 0) &&
                     (!members.supervisors || members.supervisors.data.length === 0) &&
                     (!members.students || members.students.data.length === 0))
                  ) && (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-400 mb-2">No Members Found</h3>
                      <p className="text-gray-500">This university doesn&apos;t have any registered members yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-400">Delete University</h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete <strong className="text-white">{universityData?.name}</strong>?
              </p>
              <div className="bg-gray-700/50 rounded-lg p-3 text-sm text-gray-400">
                <p className="mb-2">This will delete the university only if it has:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>No active students</li>
                  <li>No active supervisors</li>
                  <li>No active administrators</li>
                  <li>No active projects</li>
                </ul>
              </div>
              
              {deleteError && (
                <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{deleteError}</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUniversity}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete University</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Force Delete Confirmation Modal */}
      {showForceDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-red-500/50 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-400">Force Delete University</h3>
                <p className="text-sm text-red-300">⚠️ DANGEROUS OPERATION</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                University <strong className="text-white">{universityData?.name}</strong> has active users or projects.
              </p>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 mb-4">
                <p className="font-semibold mb-2">⚠️ WARNING: Force delete will permanently remove:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All students and their data</li>
                  <li>All supervisors and their data</li>
                  <li>All administrators</li>
                  <li>All projects and related information</li>
                  <li>The university itself</li>
                </ul>
                <p className="mt-2 font-semibold">This action cannot be undone!</p>
              </div>
              
              {deleteError && (
                <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{deleteError}</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowForceDeleteModal(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleForceDeleteUniversity}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Force Deleting...</span>
                  </>
                ) : (
                  <span>Force Delete All</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
