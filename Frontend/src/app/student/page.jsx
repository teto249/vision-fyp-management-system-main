"use client";
import React, { useState, useEffect } from "react";
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserIcon,
  BookOpenIcon,
  DocumentArrowDownIcon,
  ListBulletIcon
} from "@heroicons/react/24/outline";
import { getProjectById } from "../../api/StudentApi/Projects";
import { fetchStudentAccount } from "../../api/StudentApi/account";
import { generateProjectReportPDF, generateQuickTaskListPDF } from "../../utils/pdfGenerator";

export default function Dashboard() {
  const [projectData, setProjectData] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    totalMilestones: 0,
    completedMilestones: 0,
    totalMeetings: 0,
    upcomingMeetings: 0,
    totalFeedback: 0,
    projectProgress: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("No auth token found");
        return;
      }

      // Try multiple ways to get user info
      let userInfo = null;
      let username = null;

      // Method 1: Try userInfo from localStorage
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        try {
          userInfo = JSON.parse(storedUserInfo);
          username = userInfo.username;
        } catch (e) {
          console.error("Error parsing userInfo:", e);
        }
      }

      // Method 2: Try studentInfo from localStorage
      if (!username) {
        const storedStudentInfo = localStorage.getItem("studentInfo");
        if (storedStudentInfo) {
          try {
            const studentInfo = JSON.parse(storedStudentInfo);
            username = studentInfo.username;
          } catch (e) {
            console.error("Error parsing studentInfo:", e);
          }
        }
      }

      // Method 3: Try to decode token to get username
      if (!username && token) {
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          username = tokenData.username;
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }

      if (!username) {
        console.error("No user info found - tried all methods");
        // Still try to load student account data without username
        try {
          const studentData = await fetchStudentAccount();
          if (studentData) {
            setStudentInfo(studentData);
          }
        } catch (error) {
          console.error("Error loading student account:", error);
        }
        return;
      }

      

      // Load student account info
      try {
        const studentData = await fetchStudentAccount(username);
        if (studentData) {
          setStudentInfo(studentData);
        }
      } catch (error) {
        console.error("Error loading student account:", error);
      }

      // Load project data
      try {
        const projectResult = await getProjectById(username, token);
        
        if (projectResult.success && projectResult.project) {
          setProjectData(projectResult.project);
          calculateStats(projectResult.project);
          generateRecentActivities(projectResult.project);
        } else {
          console.log("No project found or failed to load project");
        }
      } catch (error) {
        console.error("Error loading project data:", error);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (project) => {
    if (!project || !project.milestones) {
      return;
    }

    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let overdueTasks = 0;
    let totalMilestones = project.milestones.length;
    let completedMilestones = 0;
    let totalMeetings = 0;
    let upcomingMeetings = 0;
    let totalFeedback = 0;

    const now = new Date();

    project.milestones.forEach(milestone => {
      if (milestone.status === 'Completed') {
        completedMilestones++;
      }

      if (milestone.tasks) {
        totalTasks += milestone.tasks.length;
        milestone.tasks.forEach(task => {
          if (task.status === 'Completed') {
            completedTasks++;
          } else if (task.status === 'Pending') {
            pendingTasks++;
            const dueDate = new Date(task.endDate || task.dueDate);
            if (dueDate < now) {
              overdueTasks++;
            }
          }

          if (task.feedback) {
            totalFeedback += task.feedback.length;
          }
        });
      }

      if (milestone.meetings) {
        totalMeetings += milestone.meetings.length;
        milestone.meetings.forEach(meeting => {
          const meetingDate = new Date(meeting.date);
          if (meetingDate > now) {
            upcomingMeetings++;
          }
        });
      }
    });

    setStats({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      totalMilestones,
      completedMilestones,
      totalMeetings,
      upcomingMeetings,
      totalFeedback,
      projectProgress: project.progress || 0
    });
  };

  const generateRecentActivities = (project) => {
    const activities = [];
    
    if (project && project.milestones) {
      project.milestones.forEach(milestone => {
        // Add milestone activities
        activities.push({
          type: 'milestone',
          title: `Milestone: ${milestone.title}`,
          status: milestone.status,
          date: milestone.createdAt || milestone.startDate,
          icon: BookOpenIcon
        });

        // Add task activities
        if (milestone.tasks) {
          milestone.tasks.forEach(task => {
            activities.push({
              type: 'task',
              title: `Task: ${task.title}`,
              status: task.status,
              date: task.createdAt || task.startDate,
              icon: CheckCircleIcon
            });
          });
        }

        // Add meeting activities
        if (milestone.meetings) {
          milestone.meetings.forEach(meeting => {
            activities.push({
              type: 'meeting',
              title: `Meeting: ${meeting.purpose}`,
              status: 'Scheduled',
              date: meeting.date,
              icon: CalendarIcon
            });
          });
        }
      });
    }

    // Sort by date (most recent first) and take top 5
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentActivities(activities.slice(0, 5));
  };

  const handleGenerateFullReport = async () => {
    if (!projectData) {
      alert("No project data available to generate report. Please make sure you have a project assigned.");
      return;
    }

    setGeneratingPDF(true);
    try {
      const result = await generateProjectReportPDF(projectData, studentInfo);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report: " + error.message);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleGenerateTaskList = async () => {
    if (!projectData || !projectData.milestones) {
      alert("No tasks available to generate task list. Please make sure you have tasks in your project.");
      return;
    }

    setGeneratingPDF(true);
    try {
      // Flatten all tasks from all milestones
      const allTasks = projectData.milestones.reduce((acc, milestone) => {
        if (milestone.tasks) {
          return [...acc, ...milestone.tasks];
        }
        return acc;
      }, []);

      if (allTasks.length === 0) {
        alert("No tasks found in your project to generate a task list.");
        setGeneratingPDF(false);
        return;
      }

      const result = await generateQuickTaskListPDF(allTasks, studentInfo);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error generating task PDF:", error);
      alert("Failed to generate task list PDF: " + error.message);
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-300 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pt-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              Welcome back, {studentInfo?.name || 'Student'}!
            </h1>
            <p className="text-gray-400">
              Here's an overview of your project progress and activities
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 lg:mt-0">
            <button
              onClick={handleGenerateTaskList}
              disabled={generatingPDF || !projectData}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 
                       disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ListBulletIcon className="h-5 w-5" />
              {generatingPDF ? 'Generating...' : 'Quick Task List'}
            </button>
            <button
              onClick={handleGenerateFullReport}
              disabled={generatingPDF || !projectData}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                       disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              {generatingPDF ? 'Generating...' : 'Generate Full Report'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Project Progress</h3>
                <p className="text-3xl font-bold mt-1">{stats.projectProgress}%</p>
              </div>
              <ChartBarIcon className="h-8 w-8 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Completed Tasks</h3>
                <p className="text-3xl font-bold mt-1">{stats.completedTasks}/{stats.totalTasks}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Pending Tasks</h3>
                <p className="text-3xl font-bold mt-1">{stats.pendingTasks}</p>
              </div>
              <ClockIcon className="h-8 w-8 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Overdue Tasks</h3>
                <p className="text-3xl font-bold mt-1">{stats.overdueTasks}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <BookOpenIcon className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold">Milestones</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold">{stats.totalMilestones}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-bold text-green-400">{stats.completedMilestones}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <CalendarIcon className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold">Meetings</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold">{stats.totalMeetings}</span>
              </div>
              <div className="flex justify-between">
                <span>Upcoming:</span>
                <span className="font-bold text-blue-400">{stats.upcomingMeetings}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <DocumentTextIcon className="h-6 w-6 text-yellow-400" />
              <h3 className="text-lg font-semibold">Feedback</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-bold text-yellow-400">{stats.totalFeedback}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        {projectData && (
          <div className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
            <h3 className="text-xl font-semibold mb-4">Current Project</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">{projectData.title}</h4>
                <p className="text-gray-300 mb-4">{projectData.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-semibold ${
                      projectData.status === 'APPROVED' ? 'text-green-400' :
                      projectData.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {projectData.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span>{new Date(projectData.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End Date:</span>
                    <span>{new Date(projectData.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Supervisor Information</h5>
                {projectData.supervisor ? (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{projectData.supervisor.name}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{projectData.supervisor.email}</p>
                    {projectData.supervisor.department && (
                      <p className="text-gray-400 text-sm">{projectData.supervisor.department}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">No supervisor assigned yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                  <activity.icon className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'Completed' ? 'bg-green-600 text-green-100' :
                    activity.status === 'In Progress' ? 'bg-yellow-600 text-yellow-100' :
                    activity.status === 'Scheduled' ? 'bg-blue-600 text-blue-100' :
                    'bg-gray-600 text-gray-100'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
}
