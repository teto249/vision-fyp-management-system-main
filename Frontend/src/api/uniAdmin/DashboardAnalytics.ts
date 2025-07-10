const API_BASE_URL = "http://localhost:3001/api/uniAdmin/analytics";

export interface DashboardMetrics {
  totalStudents: number;
  totalSupervisors: number;
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;
  completionRate: number;
  averageProgress: number;
  studentsWithProjects: number;
  studentsWithoutProjects: number;
  recentActivity: {
    newStudents: number;
    newSupervisors: number;
  };
}

export interface SystemStatus {
  active: number;
  idle: number;
  offline: number;
  lastUpdated: string;
}

export interface ProjectDetail {
  id: string;
  title: string;
  type: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  studentName: string;
  supervisorName: string;
  milestoneCount: number;
}

export interface DashboardAnalytics {
  success: boolean;
  universityId: string;
  lastUpdated: string;
  metrics: DashboardMetrics;
  milestoneProgress: number[];
  systemStatus: SystemStatus;
  projects: ProjectDetail[];
  departmentStats: Record<string, number>;
  analytics: {
    projectStatusDistribution: {
      pending: number;
      inProgress: number;
      completed: number;
    };
    progressRanges: {
      notStarted: number;
      inProgress: number;
      completed: number;
    };
  };
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const authToken = localStorage.getItem("authToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers["authorization"] = `Bearer ${authToken}`;
  } else {
    throw new ApiError("No authentication token found");
  }

  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    const errorMessage = isJson
      ? (await response.json()).message
      : response.statusText;
    throw new ApiError(errorMessage, response.status);
  }

  return isJson ? response.json() : null;
}

function isDashboardAnalytics(data: any): data is DashboardAnalytics {
  return (
    data &&
    typeof data === "object" &&
    data.success === true &&
    typeof data.metrics === "object" &&
    Array.isArray(data.milestoneProgress) &&
    typeof data.systemStatus === "object" &&
    Array.isArray(data.projects)
  );
}

export async function fetchDashboardAnalytics(universityId: string): Promise<DashboardAnalytics> {
  try {
    if (!universityId) {
      throw new ApiError("University ID is required");
    }

    const url = `${API_BASE_URL}/${encodeURIComponent(universityId)}`;
    const data = await fetchWithAuth(url);

    if (!isDashboardAnalytics(data)) {
      throw new ApiError("Invalid dashboard analytics response format");
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Failed to fetch dashboard analytics"
    );
  }
}
