'use client';
import { useState, useEffect } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  VideoCameraIcon, 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon, 
  LinkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";

import { addMeeting } from "../../../../api/StudentApi/Projects";
import { deleteMeeting } from "../../../../api/SupervisorApi/FetchProjects";
export default function Meeting({ meetings = [], onMeetingUpdate, milestoneId }) {
  const [newMeeting, setNewMeeting] = useState({ 
    date: "", 
    time: "", 
    link: "", 
    purpose: "",
    type: "Online" 
  });
  console.log("Initial meetings:", meetings);
  const [localMeetings, setLocalMeetings] = useState(meetings);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedMeetingId, setExpandedMeetingId] = useState(null);
  const [showMeetingDetails, setShowMeetingDetails] = useState({});

  useEffect(() => {
    setLocalMeetings(meetings);
  }, [meetings]);

  useEffect(() => {
    const initialVisibility = meetings.reduce((acc, meeting) => {
      acc[meeting.id] = true; // Set all meetings to visible initially
      return acc;
    }, {});
    setShowMeetingDetails(initialVisibility);
  }, [meetings]);

  const handleAddMeeting = async () => {
    try {
      if (!newMeeting.date || !newMeeting.time || !newMeeting.purpose) {
        alert("Meeting date, time and purpose are required.");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Format time to ensure it's in HH:mm format
      const formattedTime = new Date(`2000-01-01T${newMeeting.time}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const meetingData = {
        title: newMeeting.purpose.trim(),
        date: newMeeting.date,
        time: formattedTime,
        link: newMeeting.link?.trim() || '',
        type: newMeeting.type
      };

      const result = await addMeeting(milestoneId, meetingData, token);

      if (result.success) {
        const updatedMeetings = [...localMeetings, result.meeting];
        setLocalMeetings(updatedMeetings);
        onMeetingUpdate(updatedMeetings);
        setNewMeeting({ date: "", time: "", link: "", purpose: "", type: "Online" });
        setIsAdding(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error adding meeting:", error);
      alert(error instanceof Error ? error.message : "Failed to add meeting");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteMeeting = async (meetingId) => {
    try {
      if (!confirm("Are you sure you want to delete this meeting?")) {
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const result = await deleteMeeting(meetingId, token);

      if (result.success) {
        const updatedMeetings = meetings.filter((meeting) => meeting.id !== meetingId);
        onMeetingUpdate(updatedMeetings);
      } else {
        throw new Error(result.message || "Failed to delete meeting");
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert(error instanceof Error ? error.message : "Failed to delete meeting");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Add a function to format time
  const formatTime = (timeStr) => {
    try {
      return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeStr; // Return original if parsing fails
    }
  };

  const toggleMeetingDetails = (meetingId) => {
    setShowMeetingDetails(prev => ({
      ...prev,
      [meetingId]: !prev[meetingId]
    }));
  };
  return (
    <div className="mt-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-full"></div>
          <div>
            <h5 className="text-xl font-bold text-gray-100">Meetings</h5>
            <p className="text-sm text-gray-400">
              {localMeetings.length === 0 ? 'No meetings scheduled' : `${localMeetings.length} meeting${localMeetings.length > 1 ? 's' : ''} scheduled`}
            </p>
          </div>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 
                     hover:from-green-700 hover:to-green-800 text-white px-5 py-2.5 rounded-xl
                     transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Schedule Meeting</span>
          </button>
        )}
      </div>

      {/* Add Meeting Form */}
      {isAdding && (
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-6 
                      rounded-2xl border border-gray-700/50 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <h6 className="text-xl font-semibold text-gray-100">Schedule New Meeting</h6>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Purpose <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter meeting purpose or agenda..."
                value={newMeeting.purpose}
                onChange={(e) => setNewMeeting({ ...newMeeting, purpose: e.target.value })}
                className="w-full p-3 border border-gray-600/50 bg-gray-700/50 
                         text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 
                         focus:border-transparent transition-all duration-200 
                         placeholder-gray-400 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                    h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="w-full pl-10 p-3 border border-gray-600/50 bg-gray-700/50 
                           text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 
                           focus:border-transparent transition-all duration-200 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Time <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                  h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  className="w-full pl-10 p-3 border border-gray-600/50 bg-gray-700/50 
                           text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 
                           focus:border-transparent transition-all duration-200 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Type
              </label>
              <select
                value={newMeeting.type}
                onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })}
                className="w-full p-3 border border-gray-600/50 bg-gray-700/50 
                         text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 
                         focus:border-transparent transition-all duration-200 shadow-inner"
              >
                <option value="Online">🌐 Online Meeting</option>
                <option value="Physical">📍 Physical Meeting</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Link/Location
              </label>
              <div className="relative">
                {newMeeting.type === 'Online' ? (
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                    h-5 w-5 text-gray-400" />
                ) : (
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                      h-5 w-5 text-gray-400" />
                )}
                <input
                  type="text"
                  placeholder={newMeeting.type === 'Online' ? "Enter meeting link (Zoom, Teams, etc.)" : "Enter meeting location"}
                  value={newMeeting.link}
                  onChange={(e) => setNewMeeting({ ...newMeeting, link: e.target.value })}
                  className="w-full pl-10 p-3 border border-gray-600/50 bg-gray-700/50 
                           text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 
                           focus:border-transparent transition-all duration-200 
                           placeholder-gray-400 shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
            <button
              onClick={() => {
                setIsAdding(false);
                setNewMeeting({ date: "", time: "", link: "", purpose: "", type: "Online" });
              }}
              className="px-6 py-2.5 text-gray-300 hover:text-white bg-gray-700/50 
                       hover:bg-gray-600/50 rounded-xl transition-all duration-200 
                       font-medium border border-gray-600/50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMeeting}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 
                       hover:from-green-700 hover:to-green-800 disabled:from-gray-600 
                       disabled:to-gray-700 text-white px-6 py-2.5 rounded-xl 
                       transition-all duration-200 font-medium shadow-lg 
                       disabled:shadow-none transform hover:scale-105 disabled:scale-100"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" 
                          stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <CalendarIcon className="h-5 w-5" />
              )}              <span>{loading ? 'Scheduling...' : 'Schedule Meeting'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Meeting List */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetings.map((meeting) => (
          <div 
            key={meeting.id} 
            className={`bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700 
                     hover:border-gray-600 transition-all duration-200
                     ${expandedMeetingId === meeting.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                {/* Use title or purpose based on what's available */}
                <h6 className="text-gray-100 font-medium text-lg">
                  {meeting.title || meeting.purpose}
                </h6>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMeetingDetails(meeting.id)}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  {showMeetingDetails[meeting.id] ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteMeeting(meeting.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Meeting details section with animation */}
            <div 
              className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out
                          ${showMeetingDetails[meeting.id] 
                            ? 'max-h-[500px] opacity-100' 
                            : 'max-h-0 opacity-0'}`}
            >
              <div className="flex items-center gap-2 text-gray-400">
                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                <span>{meeting.date ? formatDate(meeting.date) : 'Date not set'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-400">
                <ClockIcon className="h-4 w-4 flex-shrink-0" />
                <span>{meeting.time ? formatTime(meeting.time) : 'Time not set'}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                {meeting.type === 'Online' ? (
                  <VideoCameraIcon className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                )}
                <span>{meeting.type || 'Online'}</span>
              </div>

              {meeting.link && (
                <a
                  href={meeting.link}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 
                           transition-colors duration-200 bg-blue-500/10 px-3 py-2 rounded-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon className="h-4 w-4" />
                  Join Meeting
                </a>
              )}
            </div>

            {/* Mobile expand button */}
            <button
              onClick={() => setExpandedMeetingId(
                expandedMeetingId === meeting.id ? null : meeting.id
              )}
              className="md:hidden w-full mt-3 text-gray-400 hover:text-blue-400 
                       transition-colors duration-200 flex items-center justify-center gap-1"
            >
              {expandedMeetingId === meeting.id ? (
                <>
                  <ChevronUpIcon className="h-4 w-4" />
                  <span className="text-sm">Show less</span>
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4" />
                  <span className="text-sm">Show more</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {meetings.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-400">
          <VideoCameraIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No meetings scheduled yet</p>
        </div>
      )}
    </div>
  );
}