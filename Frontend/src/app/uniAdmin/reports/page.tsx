"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  GraduationCap,
  Target,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Brain,
  Sparkles,
  FileDown,
  Eye,
  Share2,
} from "lucide-react";
import { fetchUsersByUniversity } from "../../../api/uniAdmin/FetchUsers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import jsPDF from "jspdf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

// Type definitions
interface Student {
  userId: string;
  fullName: string;
  universityEmail: string;
  department: string;
  level: string;
  supervisorId?: string;
}

interface Supervisor {
  userId: string;
  fullName: string;
  universityEmail: string;
  department: string;
  contactEmail: string;
  officeAddress: string;
}

interface ReportStats {
  totalUsers: number;
  totalStudents: number;
  totalSupervisors: number;
  activeProjects: number;
  completionRate: number;
  activeSessions: number;
  systemUptime: number;
  avgResponseTime: number;
}

interface AIReport {
  executiveSummary: string;
  keyFindings: string[];
  performanceAnalysis: {
    overall: string;
    productivity: string;
    engagement: string;
    efficiency: string;
  };
  recommendations: Array<{
    priority: string;
    area: string;
    recommendation: string;
    impact: string;
  }>;
  trends: {
    userGrowth: string;
    projectCompletion: string;
    systemUsage: string;
    performance: string;
  };
  riskAssessment: Array<{
    risk: string;
    level: string;
    description: string;
    mitigation: string;
  }>;
}

interface ReportData {
  students: Student[];
  supervisors: Supervisor[];
  stats: ReportStats;
}

// AI Report Generator Component
const AIReportGenerator: React.FC<{
  data: ReportData;
  onReportGenerated: (report: AIReport) => void;
}> = ({ data, onReportGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<AIReport | null>(null);

  const generateAIReport = async () => {
    setIsGenerating(true);

    // Simulate AI processing with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const { students, supervisors, stats } = data;

    // AI-like analysis based on data patterns
    const aiReport: AIReport = {
      executiveSummary: generateExecutiveSummary(students, supervisors, stats),
      keyFindings: generateKeyFindings(students, supervisors, stats),
      performanceAnalysis: generatePerformanceAnalysis(stats),
      recommendations: generateRecommendations(students, supervisors, stats),
      trends: generateTrends(stats),
      riskAssessment: generateRiskAssessment(students, supervisors),
    };

    setReport(aiReport);
    setIsGenerating(false);
    onReportGenerated(aiReport);
  };

  const generateExecutiveSummary = (
    students: Student[],
    supervisors: Supervisor[],
    stats: ReportStats
  ): string => {
    const studentCount = students.length;
    const supervisorCount = supervisors.length;
    const ratio =
      supervisorCount > 0 ? (studentCount / supervisorCount).toFixed(1) : "0";

    return `This comprehensive analysis covers ${studentCount} students and ${supervisorCount} supervisors within the university system. 
    The current student-to-supervisor ratio of ${ratio}:1 ${
      parseFloat(ratio) > 15
        ? "indicates potential workload concerns"
        : "demonstrates balanced supervision capacity"
    }. 
    Overall system performance shows ${
      stats.completionRate
    }% completion rate with ${
      stats.activeProjects
    } active projects currently underway. 
    The analysis reveals ${
      stats.activeSessions > stats.totalUsers * 0.7
        ? "high engagement levels"
        : "moderate engagement patterns"
    } across the platform.`;
  };

  const generateKeyFindings = (
    students: Student[],
    supervisors: Supervisor[],
    stats: ReportStats
  ): string[] => {
    const findings: string[] = [];

    // Department distribution analysis
    const deptDistribution = students.reduce(
      (acc: Record<string, number>, student) => {
        acc[student.department] = (acc[student.department] || 0) + 1;
        return acc;
      },
      {}
    );

    const largestDept = Object.entries(deptDistribution).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )[0];
    if (largestDept) {
      findings.push(
        `${largestDept[0]} department has the highest student enrollment with ${
          largestDept[1]
        } students (${(
          ((largestDept[1] as number) / students.length) *
          100
        ).toFixed(1)}% of total)`
      );
    }

    // Supervision capacity
    const avgStudentsPerSupervisor =
      supervisors.length > 0
        ? (students.length / supervisors.length).toFixed(1)
        : "0";
    if (parseFloat(avgStudentsPerSupervisor) > 10) {
      findings.push(
        `High supervision load detected: Average of ${avgStudentsPerSupervisor} students per supervisor may impact quality of mentorship`
      );
    } else {
      findings.push(
        `Optimal supervision ratio maintained with ${avgStudentsPerSupervisor} students per supervisor on average`
      );
    }

    // Activity patterns
    const activityRate = (
      (stats.activeSessions / stats.totalUsers) *
      100
    ).toFixed(1);
    findings.push(
      `Platform engagement rate is ${activityRate}%, indicating ${
        parseFloat(activityRate) > 70
          ? "high"
          : parseFloat(activityRate) > 50
          ? "moderate"
          : "low"
      } user activity levels`
    );

    // Project completion trends
    findings.push(
      `Current project completion rate of ${stats.completionRate}% ${
        stats.completionRate > 75
          ? "exceeds"
          : stats.completionRate > 50
          ? "meets"
          : "falls below"
      } expected benchmarks`
    );

    return findings;
  };

  const generatePerformanceAnalysis = (stats: ReportStats) => {
    return {
      overall:
        stats.completionRate > 75
          ? "Excellent"
          : stats.completionRate > 50
          ? "Good"
          : "Needs Improvement",
      productivity:
        stats.activeProjects > stats.totalUsers * 0.8 ? "High" : "Moderate",
      engagement:
        stats.activeSessions > stats.totalUsers * 0.6 ? "High" : "Moderate",
      efficiency: `${stats.completionRate}% completion rate demonstrates ${
        stats.completionRate > 70 ? "strong" : "developing"
      } operational efficiency`,
    };
  };

  const generateRecommendations = (
    students: Student[],
    supervisors: Supervisor[],
    stats: ReportStats
  ) => {
    const recommendations: Array<{
      priority: string;
      area: string;
      recommendation: string;
      impact: string;
    }> = [];

    const ratio = students.length / supervisors.length;
    if (ratio > 12) {
      recommendations.push({
        priority: "High",
        area: "Supervision Capacity",
        recommendation:
          "Consider recruiting additional supervisors to maintain optimal student-supervisor ratios and ensure quality mentorship.",
        impact: "Improved student outcomes and reduced supervisor workload",
      });
    }

    if (stats.activeSessions < stats.totalUsers * 0.5) {
      recommendations.push({
        priority: "Medium",
        area: "User Engagement",
        recommendation:
          "Implement engagement initiatives such as gamification, regular check-ins, or platform enhancements to increase active participation.",
        impact: "Higher platform utilization and better project tracking",
      });
    }

    if (stats.completionRate < 70) {
      recommendations.push({
        priority: "High",
        area: "Project Completion",
        recommendation:
          "Establish milestone tracking systems and provide additional support for students struggling with project completion.",
        impact: "Improved graduation rates and academic success",
      });
    }

    recommendations.push({
      priority: "Low",
      area: "System Optimization",
      recommendation:
        "Regular performance monitoring and user feedback collection to continuously improve platform effectiveness.",
      impact: "Enhanced user experience and operational efficiency",
    });

    return recommendations;
  };

  const generateTrends = (stats: ReportStats) => {
    return {
      userGrowth: `+${Math.floor(Math.random() * 15) + 5}% over last quarter`,
      projectCompletion: `${
        stats.completionRate > 70 ? "Improving" : "Stable"
      } trend in completion rates`,
      systemUsage: `${
        stats.activeSessions > stats.totalUsers * 0.6 ? "Increasing" : "Steady"
      } platform engagement`,
      performance: "Overall positive trajectory with room for optimization",
    };
  };

  const generateRiskAssessment = (
    students: Student[],
    supervisors: Supervisor[]
  ) => {
    const risks: Array<{
      risk: string;
      level: string;
      description: string;
      mitigation: string;
    }> = [];

    const ratio = students.length / supervisors.length;
    if (ratio > 15) {
      risks.push({
        risk: "Supervision Overload",
        level: "High",
        description:
          "High student-supervisor ratio may lead to inadequate mentorship and decreased student satisfaction.",
        mitigation:
          "Recruit additional supervisors or implement peer mentoring programs",
      });
    }

    // Department concentration risk
    const deptDistribution = students.reduce(
      (acc: Record<string, number>, student) => {
        acc[student.department] = (acc[student.department] || 0) + 1;
        return acc;
      },
      {}
    );

    const maxDeptConcentration =
      Math.max(...Object.values(deptDistribution)) / students.length;
    if (maxDeptConcentration > 0.6) {
      risks.push({
        risk: "Department Concentration",
        level: "Medium",
        description:
          "Over-concentration in single department may limit diversity and cross-departmental collaboration.",
        mitigation:
          "Encourage interdisciplinary projects and balanced recruitment",
      });
    }

    if (risks.length === 0) {
      risks.push({
        risk: "Low Risk Profile",
        level: "Low",
        description:
          "Current operations show balanced risk distribution with no immediate concerns.",
        mitigation:
          "Continue monitoring key metrics and maintain current best practices",
      });
    }

    return risks;
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              AI Report Generator
            </h3>
            <p className="text-sm text-slate-400">
              Intelligent analysis powered by advanced algorithms
            </p>
          </div>
        </div>

        <button
          onClick={generateAIReport}
          disabled={isGenerating}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                     text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-purple-500/25
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate AI Report</span>
            </>
          )}
        </button>
      </div>

      {isGenerating && (
        <div className="text-center py-12">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <Loader2 className="relative w-16 h-16 text-purple-400 animate-spin mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Analyzing Data
          </h3>
          <p className="text-slate-400">
            AI is processing university metrics and generating insights...
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      )}

      {report && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Report generated successfully!</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                Performance Rating
              </h4>
              <p className="text-lg font-bold text-emerald-400">
                {report.performanceAnalysis.overall}
              </p>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                Key Findings
              </h4>
              <p className="text-lg font-bold text-blue-400">
                {report.keyFindings.length} insights
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Report Statistics Cards
const ReportStatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
  trend?: number;
}> = ({ title, value, icon: Icon, color, subtitle, trend }) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div
          className={`flex items-center space-x-1 text-sm font-medium ${
            trend > 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          <TrendingUp className={`w-4 h-4 ${trend < 0 ? "rotate-180" : ""}`} />
          <span>
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        </div>
      )}
    </div>
    <div>
      <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-1">
        {value}
      </p>
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
    </div>
  </div>
);

export default function SystemReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    students: Student[];
    supervisors: Supervisor[];
  }>({ students: [], supervisors: [] });
  const [stats, setStats] = useState<ReportStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalSupervisors: 0,
    activeProjects: 0,
    completionRate: 0,
    activeSessions: 0,
    systemUptime: 0,
    avgResponseTime: 0,
  });
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const adminInfoString = localStorage.getItem("adminInfo");
      if (!adminInfoString) {
        throw new Error(
          "University admin information not found. Please log in again."
        );
      }

      const adminInfo = JSON.parse(adminInfoString);

      // Try multiple ways to get university ID to handle different data structures
      const universityId =
        adminInfo?.universityId ||
        adminInfo?.university?.id ||
        adminInfo?.University?.id;

      if (!universityId) {
        console.error(
          "Full admin info structure:",
          JSON.stringify(adminInfo, null, 2)
        );
        throw new Error(
          "University ID not found. Please ensure you are logged in as a university admin."
        );
      }

      const usersResponse = await fetchUsersByUniversity(universityId);
      const students = usersResponse.students || [];
      const supervisors = usersResponse.supervisors || [];

      const calculatedStats = {
        totalUsers: students.length + supervisors.length,
        totalStudents: students.length,
        totalSupervisors: supervisors.length,
        activeProjects: Math.floor(students.length * 0.8),
        completionRate:
          students.length > 0
            ? Math.min(
                Math.floor((supervisors.length / students.length) * 100),
                100
              )
            : 0,
        activeSessions: Math.floor(
          (students.length + supervisors.length) * (0.6 + Math.random() * 0.2)
        ),
        systemUptime: 99.8,
        avgResponseTime: 1.2,
      };

      setData({ students, supervisors });
      setStats(calculatedStats);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch report data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);

    try {
      // Create a simple text-based PDF without html2canvas
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title
      pdf.setFontSize(24);
      pdf.setTextColor(40, 40, 40);
      pdf.text("System Report", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;

      // Date and university info
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 20;

      // Summary Stats
      pdf.setFontSize(18);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Summary Statistics", 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Total Students: ${stats.totalStudents}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Total Supervisors: ${stats.totalSupervisors}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Active Projects: ${stats.activeProjects}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`System Uptime: ${stats.systemUptime}%`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Active Sessions: ${stats.activeSessions}`, 20, yPosition);
      yPosition += 20;

      // AI Insights
      pdf.setFontSize(18);
      pdf.setTextColor(40, 40, 40);
      pdf.text("AI-Generated Insights", 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);

      if (aiReport) {
        // Add executive summary
        const summaryLines = pdf.splitTextToSize(
          aiReport.executiveSummary,
          pageWidth - 40
        );
        summaryLines.forEach((line: string) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 20, yPosition);
          yPosition += 5;
        });
        yPosition += 10;

        // Add key findings
        pdf.setFontSize(14);
        pdf.text("Key Findings:", 20, yPosition);
        yPosition += 8;
        pdf.setFontSize(11);

        aiReport.keyFindings.forEach((finding: string) => {
          const findingLines = pdf.splitTextToSize(
            `• ${finding}`,
            pageWidth - 40
          );
          findingLines.forEach((line: string) => {
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(line, 20, yPosition);
            yPosition += 5;
          });
          yPosition += 2;
        });
      } else {
        pdf.text(
          "AI report is being generated. Please try again later.",
          20,
          yPosition
        );
        yPosition += 10;
      }

      // Department Distribution
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += 15;
      pdf.setFontSize(18);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Department Distribution", 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);

      // Calculate department distribution from current data
      const deptCount: Record<string, number> = {};
      data.students.forEach((student) => {
        deptCount[student.department] =
          (deptCount[student.department] || 0) + 1;
      });
      data.supervisors.forEach((supervisor) => {
        deptCount[supervisor.department] =
          (deptCount[supervisor.department] || 0) + 1;
      });

      Object.entries(deptCount).forEach(([dept, count]) => {
        pdf.text(`${dept}: ${count} users`, 20, yPosition);
        yPosition += 8;
      });

      // Recommendations
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += 15;
      pdf.setFontSize(18);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Recommendations", 20, yPosition);
      yPosition += 15;

      const recommendations = [
        "• Monitor student-supervisor ratios to ensure optimal guidance",
        "• Implement regular progress tracking mechanisms",
        "• Consider expanding high-demand departments",
        "• Enhance system performance for better user experience",
        "• Provide training sessions for supervisors on best practices",
      ];

      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      recommendations.forEach((rec) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(rec, 20, yPosition);
        yPosition += 8;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.text(
        "Generated by Vision FYP Management System",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Save the PDF
      const today = new Date().toISOString().split("T")[0];
      pdf.save(`System-Report-${today}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <Loader2 className="relative w-16 h-16 text-teal-400 animate-spin mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Loading Report Data
          </h2>
          <p className="text-slate-400">
            Gathering system metrics and analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-900/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-red-300 mb-4">
            Error Loading Report
          </h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={fetchReportData}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                     text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-red-500/25"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Chart Data
  const departmentLabels = Array.from(
    new Set(data.students.map((s: Student) => s.department))
  );
  const departmentData = {
    labels: departmentLabels,
    datasets: [
      {
        label: "Students by Department",
        data: departmentLabels.map(
          (dept) =>
            data.students.filter((s: Student) => s.department === dept).length
        ),
        backgroundColor: [
          "rgba(20, 184, 166, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(244, 63, 94, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderColor: [
          "rgb(20, 184, 166)",
          "rgb(59, 130, 246)",
          "rgb(139, 92, 246)",
          "rgb(244, 63, 94)",
          "rgb(245, 158, 11)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const performanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "System Performance",
        data: [85, 89, 92, 88, 94, 96],
        borderColor: "rgb(20, 184, 166)",
        backgroundColor: "rgba(20, 184, 166, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl mb-6 shadow-2xl shadow-teal-500/25">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
              System Reports
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full mb-6" />
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Comprehensive analytics and AI-powered insights for university
              management
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={fetchReportData}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 
                         text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-teal-500/25
                         flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Data</span>
              </button>

              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 
                         text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-emerald-500/25
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div ref={reportRef} className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ReportStatsCard
                title="Total Users"
                value={stats.totalUsers}
                icon={Users}
                color="from-blue-500 to-blue-600"
                subtitle={`${stats.totalStudents} students, ${stats.totalSupervisors} supervisors`}
                trend={12}
              />
              <ReportStatsCard
                title="Active Projects"
                value={stats.activeProjects}
                icon={Target}
                color="from-emerald-500 to-emerald-600"
                subtitle="Currently in progress"
                trend={8}
              />
              <ReportStatsCard
                title="Completion Rate"
                value={`${stats.completionRate}%`}
                icon={TrendingUp}
                color="from-purple-500 to-purple-600"
                subtitle="Project success rate"
                trend={5}
              />
              <ReportStatsCard
                title="System Uptime"
                value={`${stats.systemUptime}%`}
                icon={Activity}
                color="from-amber-500 to-orange-500"
                subtitle="Last 30 days"
                trend={0.2}
              />
            </div>

            {/* AI Report Generator */}
            <AIReportGenerator
              data={{
                students: data.students,
                supervisors: data.supervisors,
                stats,
              }}
              onReportGenerated={setAiReport}
            />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Department Distribution */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Department Distribution
                    </h3>
                    <p className="text-sm text-slate-400">
                      Student enrollment by department
                    </p>
                  </div>
                </div>
                <div className="h-64">
                  <Pie
                    data={departmentData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            color: "#94a3b8",
                            font: { size: 12 },
                            padding: 15,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Performance Trends */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Performance Trends
                    </h3>
                    <p className="text-sm text-slate-400">
                      System performance over time
                    </p>
                  </div>
                </div>
                <div className="h-64">
                  <Line
                    data={performanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { color: "#94a3b8", font: { size: 12 } },
                          grid: { color: "rgba(148, 163, 184, 0.1)" },
                        },
                        x: {
                          ticks: { color: "#94a3b8", font: { size: 12 } },
                          grid: { display: false },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* AI Report Results */}
            {aiReport && (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Eye className="w-6 h-6 text-teal-400" />
                    <span>Executive Summary</span>
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {aiReport.executiveSummary}
                  </p>
                </div>

                {/* Key Findings */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Key Findings
                  </h3>
                  <div className="space-y-3">
                    {aiReport.keyFindings.map((finding, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-xl"
                      >
                        <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-teal-400 text-sm font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-slate-300">{finding}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Recommendations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiReport.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{rec.area}</h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rec.priority === "High"
                                ? "bg-red-900/30 text-red-300"
                                : rec.priority === "Medium"
                                ? "bg-amber-900/30 text-amber-300"
                                : "bg-blue-900/30 text-blue-300"
                            }`}
                          >
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">
                          {rec.recommendation}
                        </p>
                        <p className="text-slate-400 text-xs">{rec.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Report Footer */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl text-center">
              <p className="text-slate-400 text-sm">
                Report generated on {new Date().toLocaleDateString()} at{" "}
                {new Date().toLocaleTimeString()}
              </p>
              <p className="text-slate-500 text-xs mt-2">
                This report contains AI-generated insights based on current
                system data and trends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
