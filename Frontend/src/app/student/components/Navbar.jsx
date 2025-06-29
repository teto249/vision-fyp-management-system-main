"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Search,
  GraduationCap,
  BookOpen,
  RefreshCw
} from "lucide-react";
import { logout } from "../../../api/auth";

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  profileOpen,
  setProfileOpen,
}) {
  const [studentInfo, setStudentInfo] = useState({});
  const [projectData, setProjectData] = useState(null);
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedInfo = JSON.parse(localStorage.getItem("studentInfo"));
    if (storedInfo) {
      setStudentInfo(storedInfo);
    }
    loadProjectDataForNotifications();
  }, []);

  const loadProjectDataForNotifications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      // Try to get username from multiple sources
      let username = null;
      const storedUserInfo = localStorage.getItem("userInfo");
      const storedStudentInfo = localStorage.getItem("studentInfo");
      
      if (storedUserInfo) {
        try {
          const userInfo = JSON.parse(storedUserInfo);
          username = userInfo.username;
        } catch (e) {}
      }
      
      if (!username && storedStudentInfo) {
        try {
          const studentInfo = JSON.parse(storedStudentInfo);
          username = studentInfo.username;
        } catch (e) {}
      }

      if (!username) return;

      // Import the API function dynamically to avoid circular imports
      const { getProjectById } = await import('../../../api/StudentApi/Projects');
      const projectResult = await getProjectById(username, token);
      
      if (projectResult.success && projectResult.project) {
        setProjectData(projectResult.project);
        generateNotifications(projectResult.project);
      }
    } catch (error) {
      console.error("Error loading project data for notifications:", error);
      // Set default empty notifications on error
      setNotifications([]);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const refreshNotifications = () => {
    loadProjectDataForNotifications();
  };

  const generateNotifications = (project) => {
    const newNotifications = [];
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    if (!project || !Array.isArray(project.milestones)) {
      setNotifications([]);
      return;
    }

    project.milestones.forEach(milestone => {
      if (!milestone) return;

      // Check for overdue milestones
      if (milestone.endDate && milestone.status !== 'Completed' && milestone.status !== 'completed') {
        const dueDate = new Date(milestone.endDate);
        if (!isNaN(dueDate)) {
          if (dueDate < now) {
            newNotifications.push({
              id: `milestone-overdue-${milestone.id}`,
              title: "⚠️ Overdue Milestone",
              message: `"${milestone.title || 'Milestone'}" was due ${getRelativeTime(dueDate)}`,
              time: getRelativeTime(dueDate),
              type: "deadline",
              unread: true,
              priority: "high"
            });
          } else if (dueDate <= oneWeekFromNow) {
            newNotifications.push({
              id: `milestone-due-${milestone.id}`,
              title: "📅 Milestone Due Soon",
              message: `"${milestone.title || 'Milestone'}" is due ${getRelativeTime(dueDate)}`,
              time: getRelativeTime(dueDate),
              type: "deadline",
              unread: true,
              priority: "medium"
            });
          }
        }
      }

      // Check for overdue tasks
      if (Array.isArray(milestone.tasks)) {
        milestone.tasks.forEach(task => {
          if (!task) return;
          
          if (task.dueDate && task.status !== 'Completed' && task.status !== 'completed') {
            const dueDate = new Date(task.dueDate);
            if (!isNaN(dueDate)) {
              if (dueDate < now) {
                newNotifications.push({
                  id: `task-overdue-${task.id}`,
                  title: "⚠️ Overdue Task",
                  message: `"${task.title || 'Task'}" was due ${getRelativeTime(dueDate)}`,
                  time: getRelativeTime(dueDate),
                  type: "deadline",
                  unread: true,
                  priority: "high"
                });
              } else if (dueDate <= oneWeekFromNow) {
                newNotifications.push({
                  id: `task-due-${task.id}`,
                  title: "📋 Task Due Soon",
                  message: `"${task.title || 'Task'}" is due ${getRelativeTime(dueDate)}`,
                  time: getRelativeTime(dueDate),
                  type: "deadline",
                  unread: true,
                  priority: "medium"
                });
              }
            }
          }

          // Check for new feedback (if feedback structure exists)
          if (Array.isArray(task.feedback)) {
            task.feedback.forEach(feedback => {
              if (!feedback) return;
              
              const feedbackDate = new Date(feedback.createdAt || feedback.date);
              if (!isNaN(feedbackDate)) {
                const daysSinceFeedback = Math.floor((now - feedbackDate) / (1000 * 60 * 60 * 24));
                
                if (daysSinceFeedback <= 3) { // Show feedback from last 3 days
                  newNotifications.push({
                    id: `feedback-${feedback.id}`,
                    title: "💬 New Supervisor Feedback",
                    message: `Feedback on "${task.title || 'Task'}": ${feedback.comment || feedback.title || 'New feedback received'}`,
                    time: getRelativeTime(feedbackDate),
                    type: "feedback",
                    unread: daysSinceFeedback <= 1,
                    priority: "medium"
                  });
                }
              }
            });
          }
        });
      }

      // Check for upcoming meetings
      if (Array.isArray(milestone.meetings)) {
        milestone.meetings.forEach(meeting => {
          if (!meeting) return;
          
          const meetingDateTime = new Date(`${meeting.date} ${meeting.time || '00:00'}`);
          if (!isNaN(meetingDateTime)) {
            const hoursUntilMeeting = (meetingDateTime - now) / (1000 * 60 * 60);
            
            if (hoursUntilMeeting > 0 && hoursUntilMeeting <= 24) {
              newNotifications.push({
                id: `meeting-${meeting.id}`,
                title: "🤝 Upcoming Meeting",
                message: `${meeting.purpose || meeting.title || 'Project meeting'} scheduled for ${getRelativeTime(meetingDateTime)}`,
                time: getRelativeTime(meetingDateTime),
                type: "meeting",
                unread: true,
                priority: hoursUntilMeeting <= 2 ? "high" : "medium"
              });
            }
          }
        });
      }
    });

    // Add project status notifications
    if (project.status === 'PENDING') {
      newNotifications.push({
        id: 'project-pending',
        title: "⏳ Project Pending",
        message: "Your project is awaiting supervisor approval",
        time: "ongoing",
        type: "info",
        unread: true,
        priority: "low"
      });
    }

    // Sort by priority and date
    newNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by most recent/urgent
      return new Date(b.time) - new Date(a.time);
    });

    // Limit to 10 most important notifications
    setNotifications(newNotifications.slice(0, 10));
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMs < 0) {
      // Future date
      const futureDays = Math.abs(diffDays);
      const futureHours = Math.abs(diffHours);
      const futureMinutes = Math.abs(diffMinutes);
      
      if (futureDays > 0) return `in ${futureDays} day${futureDays > 1 ? 's' : ''}`;
      if (futureHours > 0) return `in ${futureHours} hour${futureHours > 1 ? 's' : ''}`;
      if (futureMinutes > 0) return `in ${futureMinutes} minute${futureMinutes > 1 ? 's' : ''}`;
      return 'in a few moments';
    }

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'just now';
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-xl">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 group"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              ) : (
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  VISION
                </h1>
                <p className="text-xs text-slate-400">Student Portal</p>
              </div>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 group"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-700/50 z-50">
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={refreshNotifications}
                          className="text-xs text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700/50"
                          title="Refresh notifications"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-slate-400">
                          {notifications.filter((n) => n.unread).length} unread
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No notifications</p>
                        <p className="text-slate-500 text-xs mt-1">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          className={`p-4 hover:bg-slate-700/30 transition-colors cursor-pointer border-l-2 ${
                            notification.unread
                              ? "border-blue-500 bg-blue-500/5"
                              : "border-transparent"
                          } ${
                            notification.priority === 'high' 
                              ? 'bg-red-500/5 border-red-500/50' 
                              : notification.priority === 'medium' 
                              ? 'bg-orange-500/5 border-orange-500/50' 
                              : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notification.priority === 'high' 
                                  ? 'bg-red-500' 
                                  : notification.priority === 'medium' 
                                  ? 'bg-orange-500' 
                                  : notification.unread 
                                  ? 'bg-blue-500' 
                                  : 'bg-slate-600'
                              }`}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`font-medium text-sm ${
                                  notification.unread ? "text-white" : "text-slate-300"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              <p className="text-sm text-slate-400 truncate leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-700/50 text-center">
                    <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" data-menu>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center space-x-3 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 group"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all duration-200">
                  <Image
                    src={studentInfo.profilePhoto || "/logo.png"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white truncate max-w-24">
                    {studentInfo.fullName || "Loading..."}
                  </p>
                  <p className="text-xs text-slate-400">Student</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-700/50 z-[60] opacity-100 scale-100 transform transition-all duration-200">
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-slate-700">
                        <Image
                          src={studentInfo.profilePhoto || "/logo.png"}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">
                          {studentInfo.fullName || "Loading..."}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {studentInfo.email || "student@university.edu"}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                          <span className="text-xs text-emerald-400">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/student/account"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Profile Settings</span>
                    </Link>

                    <Link
                      href="/student/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Preferences</span>
                    </Link>
                  </div>

                  <div className="p-2 border-t border-slate-700/50">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
