"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Users, MapPin, Plus, Edit, Trash2 } from "lucide-react";

// Types
interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  participants: string[];
  type: "meeting" | "supervision" | "presentation";
  status: "scheduled" | "completed" | "cancelled";
  description?: string;
}

export default function SupervisorSchedulePage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");

  useEffect(() => {
    fetchMeetings();
  }, [selectedDate]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockMeetings: Meeting[] = [
        {
          id: "1",
          title: "FYP Progress Review - John Doe",
          date: "2025-07-02",
          time: "10:00",
          duration: 60,
          location: "Room 301",
          participants: ["John Doe", "Jane Smith"],
          type: "supervision",
          status: "scheduled",
          description: "Review of project milestone 2"
        },
        {
          id: "2",
          title: "Project Proposal Presentation",
          date: "2025-07-03",
          time: "14:30",
          duration: 90,
          location: "Conference Room A",
          participants: ["Alice Johnson", "Bob Wilson"],
          type: "presentation",
          status: "scheduled",
          description: "Final project proposal presentation"
        }
      ];
      setMeetings(mockMeetings);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-500";
      case "supervision": return "bg-green-500";
      case "presentation": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "text-green-600";
      case "completed": return "text-blue-600";
      case "cancelled": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-2xl">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
              Schedule Management
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6" />
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Manage your meetings, supervisions, and presentations
            </p>
          </div>

          {/* Controls */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as "day" | "week" | "month")}
                className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Day View</option>
                <option value="week">Week View</option>
                <option value="month">Month View</option>
              </select>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </button>
          </div>

          {/* Schedule Grid */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              {meetings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">No meetings scheduled</h3>
                  <p className="text-slate-400 mb-6">You don&apos;t have any meetings scheduled for this period.</p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    Schedule Your First Meeting
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="bg-slate-800/50 border border-slate-600/50 rounded-xl p-6 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${getTypeColor(meeting.type)}`}></div>
                            <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(meeting.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(meeting.time)} ({meeting.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <MapPin className="w-4 h-4" />
                              <span>{meeting.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{meeting.participants.join(", ")}</span>
                          </div>

                          {meeting.description && (
                            <p className="text-slate-400 text-sm">{meeting.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
