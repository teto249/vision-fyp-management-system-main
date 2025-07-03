const API_BASE_URL = "http://localhost:3000/api/supervisor";

interface StudentData {
  id: string;
  name: string;
  email: string;
  course: string;
  level: string;
  progress: number;
  assignments: Array<{
    id: string;
    title: string;
    status: string;
    dueDate?: string;
    milestone?: string;
  }>;
  attendance: number;
  lastActive: string;
  project?: any;
}

interface AIReportResponse {
  success: boolean;
  report?: string;
  summary?: {
    totalStudents: number;
    averageProgress: number;
    completedTasks: number;
    totalTasks: number;
    recommendations: string[];
  };
  message?: string;
}

export const generateAIReport = async (students: StudentData[]): Promise<AIReportResponse> => {
  try {
    const token = localStorage.getItem("authToken");
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );

    if (!token || !supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    // Prepare data for AI analysis
    const analysisData = {
      supervisorId: supervisorInfo.userId,
      students: students.map(student => ({
        id: student.id,
        name: student.name,
        progress: student.progress,
        totalTasks: student.assignments.length,
        completedTasks: student.assignments.filter(a => a.status === 'completed').length,
        inProgressTasks: student.assignments.filter(a => a.status === 'in-progress').length,
        overdueTasks: student.assignments.filter(a => a.status === 'overdue').length,
        course: student.course,
        level: student.level,
        attendance: student.attendance,
        lastActive: student.lastActive,
        projectTitle: student.project?.title || 'No Project Assigned',
        milestonesCount: student.project?.milestones?.length || 0,
        completedMilestones: student.project?.milestones?.filter((m: any) => m.status === 'Completed').length || 0
      }))
    };

    const response = await fetch(`${API_BASE_URL}/${supervisorInfo.userId}/ai-report`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analysisData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to generate AI report");
    }

    return {
      success: true,
      report: data.report,
      summary: data.summary
    };

  } catch (error) {
    console.error("Error generating AI report:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to generate AI report",
    };
  }
};

// Generate a quick summary report
export const generateQuickSummary = (students: StudentData[]) => {
  if (!students.length) {
    return {
      totalStudents: 0,
      averageProgress: 0,
      completedTasks: 0,
      totalTasks: 0,
      recommendations: ["No students assigned yet. Start by assigning students to projects."]
    };
  }

  const totalStudents = students.length;
  const averageProgress = Math.round(
    students.reduce((sum, student) => sum + student.progress, 0) / totalStudents
  );
  const completedTasks = students.reduce(
    (sum, student) => sum + student.assignments.filter(a => a.status === 'completed').length,
    0
  );
  const totalTasks = students.reduce(
    (sum, student) => sum + student.assignments.length,
    0
  );

  const recommendations = [];
  
  // Generate basic recommendations based on data
  if (averageProgress < 30) {
    recommendations.push("⚠️ Overall progress is low. Consider scheduling individual meetings with students.");
  } else if (averageProgress < 60) {
    recommendations.push("📈 Progress is moderate. Encourage students to maintain consistent work pace.");
  } else {
    recommendations.push("✅ Excellent progress! Keep up the good work and maintain regular check-ins.");
  }

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  if (completionRate < 40) {
    recommendations.push("📋 Task completion rate is low. Review deadlines and provide additional support.");
  } else if (completionRate > 80) {
    recommendations.push("🎯 High task completion rate. Consider introducing more challenging milestones.");
  }

  // Check for students with very low progress
  const strugglingStudents = students.filter(s => s.progress < 20);
  if (strugglingStudents.length > 0) {
    recommendations.push(`🔍 ${strugglingStudents.length} student(s) need immediate attention: ${strugglingStudents.map(s => s.name).join(', ')}`);
  }

  // Check for high performers
  const highPerformers = students.filter(s => s.progress > 85);
  if (highPerformers.length > 0) {
    recommendations.push(`⭐ Recognize high performers: ${highPerformers.map(s => s.name).join(', ')}`);
  }

  return {
    totalStudents,
    averageProgress,
    completedTasks,
    totalTasks,
    recommendations
  };
};
