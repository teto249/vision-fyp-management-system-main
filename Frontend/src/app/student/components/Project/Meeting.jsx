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
  ChevronUpIcon,
  PencilIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

import { addMeeting, deleteMeeting, updateMeeting } from "../../../../api/StudentApi/Projects";
export default function Meeting({ meetings = [], onMeetingUpdate, milestoneId }) {

  const [newMeeting, setNewMeeting] = useState({ 
    date: "", 
    time: "", 
    link: "", 
    purpose: "",
    type: "Online" 
  });

  const [localMeetings, setLocalMeetings] = useState(meetings);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedMeetingId, setExpandedMeetingId] = useState(null);
  const [showMeetingDetails, setShowMeetingDetails] = useState({});
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [editForm, setEditForm] = useState({ 
    date: "", 
    time: "", 
    link: "", 
    purpose: "",
    type: "Online" 
  });

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
      // Enhanced validation
      if (!newMeeting.purpose?.trim()) {
        alert("Meeting purpose is required");
        return;
      }
      if (newMeeting.purpose.trim().length < 5) {
        alert("Meeting purpose must be at least 5 characters long");
        return;
      }
      if (!newMeeting.date) {
        alert("Meeting date is required");
        return;
      }
      if (!newMeeting.time) {
        alert("Meeting time is required");
        return;
      }

      // Validate meeting is not in the past
      const meetingDateTime = new Date(`${newMeeting.date}T${newMeeting.time}`);
      const now = new Date();
      
      if (meetingDateTime <= now) {
        alert("Meeting date and time cannot be in the past");
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
      alert(error instanceof Error ? error.message : "Failed to add meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!confirm("Are you sure you want to delete this meeting?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const result = await deleteMeeting(milestoneId, meetingId, token);

      if (result.success) {
        const updatedMeetings = localMeetings.filter((meeting) => meeting.id !== meetingId);
        setLocalMeetings(updatedMeetings);
        onMeetingUpdate(updatedMeetings);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete meeting");
    }
  };

  const handleEditMeeting = (meeting) => {
    setEditingMeeting(meeting.id);
    const meetingDate = new Date(meeting.date);
    setEditForm({
      date: meetingDate.toISOString().split('T')[0],
      time: meeting.time ? meeting.time : meetingDate.toTimeString().slice(0, 5),
      link: meeting.link || "",
      purpose: meeting.purpose || meeting.title || "",
      type: meeting.type || "Online"
    });
  };

  const handleUpdateMeeting = async () => {
    try {
      // Enhanced validation
      if (!editForm.purpose?.trim()) {
        alert("Meeting purpose is required");
        return;
      }
      if (editForm.purpose.trim().length < 5) {
        alert("Meeting purpose must be at least 5 characters");
        return;
      }
      if (!editForm.date) {
        alert("Meeting date is required");
        return;
      }
      if (!editForm.time) {
        alert("Meeting time is required");
        return;
      }

      // Validate date is not in the past
      const selectedDateTime = new Date(`${editForm.date}T${editForm.time}`);
      const now = new Date();
      
      if (selectedDateTime < now) {
        alert("Meeting date and time cannot be in the past");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const meetingData = {
        title: editForm.purpose.trim(),
        date: selectedDateTime.toISOString(),
        link: editForm.link.trim(),
        type: editForm.type
      };

      const result = await updateMeeting(milestoneId, editingMeeting, meetingData, token);

      if (result.success) {
        const updatedMeetings = localMeetings.map((meeting) =>
          meeting.id === editingMeeting ? { ...meeting, ...result.meeting } : meeting
        );
        setLocalMeetings(updatedMeetings);
        onMeetingUpdate(updatedMeetings);
        setEditingMeeting(null);
        setEditForm({ date: "", time: "", link: "", purpose: "", type: "Online" });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMeeting(null);
    setEditForm({ date: "", time: "", link: "", purpose: "", type: "Online" });
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
      // Handle empty or invalid time strings
      if (!timeStr || !timeStr.trim()) {
        return 'Time not set';
      }
      
      // If it's already in a readable format (like "10:30 AM"), return as is
      if (timeStr.includes('AM') || timeStr.includes('PM')) {
        return timeStr;
      }
      
      // Try to parse and format HH:mm format
      return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeStr || 'Time not set'; // Return original if parsing fails
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
            className="group flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 
                     hover:from-green-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl
                     transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Schedule Meeting</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 space-y-4">
          <h6 className="text-gray-200 font-medium mb-4">New Meeting Details</h6>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Purpose*</label>
              <input
                type="text"
                placeholder="Meeting purpose"
                value={newMeeting.purpose}
                onChange={(e) => setNewMeeting({ ...newMeeting, purpose: e.target.value })}
                className="w-full p-2 border border-gray-600 bg-gray-700/50 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Meeting Type</label>
              <select
                value={newMeeting.type}
                onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })}
                className="w-full p-2 border border-gray-600 bg-gray-700/50 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Online">Online</option>
                <option value="Physical">Physical</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Date*</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={newMeeting.date}
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="w-full pl-10 p-2 border border-gray-600 bg-gray-700/50 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Time*</label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  className="w-full pl-10 p-2 border border-gray-600 bg-gray-700/50 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {newMeeting.type === 'Online' && (
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm text-gray-400">Meeting Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={newMeeting.link}
                    onChange={(e) => setNewMeeting({ ...newMeeting, link: e.target.value })}
                    className="w-full pl-10 p-2 border border-gray-600 bg-gray-700/50 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMeeting}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                       text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <PlusIcon className="h-5 w-5" />
              )}
              Schedule Meeting
            </button>
          </div>
        </div>
      )}

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
                {/* Use purpose first, then title as fallback */}
                <h6 className="text-gray-100 font-medium text-lg">
                  {meeting.purpose || meeting.title || "Untitled Meeting"}
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
                  onClick={() => handleEditMeeting(meeting)}
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                >
                  <PencilIcon className="h-5 w-5" />
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
                <span>
                  {meeting.time && meeting.time.trim() 
                    ? formatTime(meeting.time) 
                    : 'Time not set'}
                </span>
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

            {/* Edit meeting form - hidden by default */}
            {editingMeeting === meeting.id && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <h6 className="text-gray-200 font-medium mb-4">Edit Meeting</h6>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Purpose*</label>
                    <input
                      type="text"
                      placeholder="Meeting purpose"
                      value={editForm.purpose}
                      onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                      className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Meeting Type</label>
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Online">Online</option>
                      <option value="Physical">Physical</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Date*</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={editForm.date}
                        min={new Date().toISOString().split('T')[0]} // Prevent past dates
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="w-full pl-10 p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Time*</label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="time"
                        value={editForm.time}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        className="w-full pl-10 p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {editForm.type === 'Online' && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm text-gray-400">Meeting Link</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://meet.google.com/..."
                          value={editForm.link}
                          onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                          className="w-full pl-10 p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateMeeting}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                             text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <PencilIcon className="h-5 w-5" />
                    )}
                    Update Meeting
                  </button>
                </div>
              </div>
            )}
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