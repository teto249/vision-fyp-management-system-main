'use client';
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Meeting({ meetings, onMeetingUpdate }) {
  const [newMeeting, setNewMeeting] = useState({ date: "", time: "", link: "", purpose: "" });

  const handleAddMeeting = () => {
    if (!newMeeting.date || !newMeeting.time || !newMeeting.link || !newMeeting.purpose) {
      alert("All fields are required.");
      return;
    }
    const updatedMeetings = [
      ...meetings,
      { id: Date.now(), ...newMeeting },
    ];
    onMeetingUpdate(updatedMeetings);
    setNewMeeting({ date: "", time: "", link: "", purpose: "" });
  };

  const handleDeleteMeeting = (meetingId) => {
    const updatedMeetings = meetings.filter((meeting) => meeting.id !== meetingId);
    onMeetingUpdate(updatedMeetings);
  };

  return (
    <div className="mt-4">
      <h5 className="font-medium text-gray-300 mb-3">Meetings</h5>
      {meetings.map((meeting) => (
        <div key={meeting.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-2">
          <p className="text-gray-100">{meeting.purpose}</p>
          <p className="text-gray-400 text-sm">
            {meeting.date} at {meeting.time}
          </p>
          <a
            href={meeting.link}
            className="text-blue-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Meeting
          </a>
          <button onClick={() => handleDeleteMeeting(meeting.id)}>Delete</button>
        </div>
      ))}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Purpose"
          value={newMeeting.purpose}
          onChange={(e) => setNewMeeting({ ...newMeeting, purpose: e.target.value })}
          className="w-full p-2 border border-gray-600 bg-gray-800 text-gray-100 rounded mb-2"
        />
        <input
          type="date"
          value={newMeeting.date}
          onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
          className="w-full p-2 border border-gray-600 bg-gray-800 text-gray-100 rounded mb-2"
        />
        <input
          type="time"
          value={newMeeting.time}
          onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
          className="w-full p-2 border border-gray-600 bg-gray-800 text-gray-100 rounded mb-2"
        />
        <input
          type="url"
          placeholder="Meeting Link"
          value={newMeeting.link}
          onChange={(e) => setNewMeeting({ ...newMeeting, link: e.target.value })}
          className="w-full p-2 border border-gray-600 bg-gray-800 text-gray-100 rounded mb-2"
        />
        <button
          onClick={handleAddMeeting}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
        >
          <PlusIcon className="h-4 w-4" />
          Add Meeting
        </button>
      </div>
    </div>
  );
}