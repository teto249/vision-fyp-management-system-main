"use client";
import { useEffect, useState } from "react";
import Card from "./ui/Card";
import { fetchUniversities, deleteUniversity, forceDeleteUniversity } from "../../../api/admin/fetchUniversities";
import { useRouter } from "next/navigation";

export default function UniversityPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForceDeleteModal, setShowForceDeleteModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Fix hydration error by ensuring client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
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
  }, [mounted]);

  // Don't render until component is mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const handleViewUniversity = (universityId) => {
    router.push(`/admin/universities/${universityId}`);
  };

  const filteredUniversities = universities
    .filter(
      (uni) =>
        (uni.fullName && uni.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (uni.shortName && uni.shortName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((uni) => (filter === "all" ? true : uni.status === filter));

  const handleDeleteUniversity = async () => {
    if (!selectedUniversity) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await deleteUniversity(selectedUniversity.id);
      
      // Remove the university from the list
      setUniversities(prev => prev.filter(uni => uni.id !== selectedUniversity.id));
      
      // Show success message
      alert(`University "${response.deletedUniversity?.name}" has been successfully deleted.`);
      
      // Close modal
      setShowDeleteModal(false);
      setSelectedUniversity(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete university';
      console.error('List page delete error:', error);
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
    if (!selectedUniversity) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await forceDeleteUniversity(selectedUniversity.id, true);
      
      // Remove the university from the list
      setUniversities(prev => prev.filter(uni => uni.id !== selectedUniversity.id));
      
      // Show success message with details
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
      
      // Close modal
      setShowForceDeleteModal(false);
      setSelectedUniversity(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to force delete university';
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (universityId) => {
    const university = universities.find(uni => uni.id === universityId);
    setSelectedUniversity(university);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-2 border-green-200 opacity-25 mx-auto"></div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium text-white">Loading Universities</h3>
            <p className="text-gray-400 mt-2">Please wait while we fetch the latest data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-red-900/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Universities</h3>
            <p className="text-red-300 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={() => router.back()}
                className="absolute left-0 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
            </div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            <h1 className="text-5xl font-bold text-white mb-4">
              Partner Universities
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our partner universities and monitor their system utilization, capacity, and performance metrics
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-green-400">{universities.length}</div>
                <div className="text-gray-400 text-sm mt-1">Total Universities</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-blue-400">
                  {universities.filter(u => u.status === 'active').length}
                </div>
                <div className="text-gray-400 text-sm mt-1">Active</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-yellow-400">
                  {filteredUniversities.length}
                </div>
                <div className="text-gray-400 text-sm mt-1">Filtered Results</div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search universities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-700/50 rounded-lg border border-gray-600/50 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "grid" 
                        ? "bg-green-600 text-white" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "list" 
                        ? "bg-green-600 text-white" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Summary */}
            {(searchTerm || filter !== "all") && (
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">
                    Showing {filteredUniversities.length} of {universities.length} universities
                    {searchTerm && <span> matching "{searchTerm}"</span>}
                    {filter !== "all" && <span> with status "{filter}"</span>}
                  </div>
                  {(searchTerm || filter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilter("all");
                      }}
                      className="text-green-400 hover:text-green-300 transition-colors duration-200"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Universities Grid/List */}
          {filteredUniversities.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No Universities Found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We couldn&apos;t find any universities matching your current search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : (
            <div className={`${
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
                : "space-y-4"
            }`}>
              {filteredUniversities.map((uni, index) => (
                <div 
                  key={uni.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card
                    id={uni.id}
                    title={uni.title}
                    description={uni.description}
                    image={uni.image}
                    location={uni.location}
                    students={uni.students}
                    capacity={uni.capacity}
                    status={uni.status}
                    onView={handleViewUniversity}
                    viewMode={viewMode}
                    onDelete={handleDeleteClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-sm w-full z-10">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Confirm Deletion</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete the university "{selectedUniversity?.title}"?
              </p>
              
              {/* Error Message */}
              {deleteError && (
                <div className="bg-red-900/20 p-4 rounded-lg mb-4">
                  <p className="text-red-400 text-sm">{deleteError}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUniversity}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isDeleting ? (
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                  ) : (
                    "Delete University"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Force Delete Confirmation Modal */}
      {showForceDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-sm w-full z-10">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Force Delete University</h3>
              <p className="text-gray-400 mb-6">
                This university has active users. Please choose a deletion option:
              </p>

              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleForceDeleteUniversity}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isDeleting ? (
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                  ) : (
                    "Force Delete University"
                  )}
                </button>
                <button
                  onClick={() => setShowForceDeleteModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
