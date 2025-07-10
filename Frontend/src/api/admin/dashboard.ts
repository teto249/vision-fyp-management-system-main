const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface DashboardStats {
  totalUsers: number;
  totalUniversities: number;
  totalStudents: number;
  totalSupervisors: number;
  totalAdmins: number;
  activeProjects: number;
  completedProjects: number;
  capacityUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    university?: string;
  }>;
  universityStats: Array<{
    id: string;
    name: string;
    users: number;
    capacity: number;
    status: 'normal' | 'warning' | 'critical';
    maxStudents: number;
    maxSupervisors: number;
    currentStudents: number;
    currentSupervisors: number;
  }>;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}
