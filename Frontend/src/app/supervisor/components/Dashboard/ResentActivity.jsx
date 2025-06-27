"use client";
import React from "react";
import { Clock, User, CheckCircle, AlertCircle } from "lucide-react";

export default function ResentActivity({ students = [] }) {
  // Generate recent activities from student data
  const generateRecentActivities = () => {
    const activities = [];
    
    students.forEach(student => {
      // Add progress milestones
      if (student.progress > 0) {
        activities.push({
          id: `progress-${student.id}`,
          type: 'progress',
          student: student.name,
          message: `achieved ${student.progress}% project progress`,
          time: '2 hours ago',
          icon: CheckCircle,
          color: 'text-teal-400'
        });
      }
      
      // Add completed tasks
      const completedTasks = student.assignments.filter(a => a.status === 'completed');
      if (completedTasks.length > 0) {
        activities.push({
          id: `tasks-${student.id}`,
          type: 'task',
          student: student.name,
          message: `completed ${completedTasks.length} task(s)`,
          time: '1 day ago',
          icon: CheckCircle,
          color: 'text-green-400'
        });
      }
      
      // Add overdue tasks
      const overdueTasks = student.assignments.filter(a => a.status === 'overdue');
      if (overdueTasks.length > 0) {
        activities.push({
          id: `overdue-${student.id}`,
          type: 'overdue',
          student: student.name,
          message: `has ${overdueTasks.length} overdue task(s)`,
          time: '3 days ago',
          icon: AlertCircle,
          color: 'text-red-400'
        });
      }
    });
    
    // Sort by most recent and limit to 5
    return activities.slice(0, 5);
  };

  const recentActivities = generateRecentActivities();

  return (
    <div className="bg-gray-700 shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-600 sm:px-6">
        <h3 className="text-lg font-medium text-gray-100">Recent Activity</h3>
      </div>
      <div className="p-6">
        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-8 w-8 text-gray-400 mb-3" />
            <h3 className="text-sm font-medium text-gray-300 mb-1">No Recent Activity</h3>
            <p className="text-sm text-gray-400">
              Student activities will appear here as they make progress on their projects.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-600">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-300">
                      <span className="font-medium text-gray-100">
                        {activity.student}
                      </span>{" "}
                      {activity.message}
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
