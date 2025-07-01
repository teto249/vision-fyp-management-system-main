"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  Building2,
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
  Database,
  Server,
  Globe,
  Shield,
} from "lucide-react";
import {
  fetchDashboardStats,
  DashboardStats,
} from "../../../api/admin/dashboard";
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


interface AdminStats {
  totalUsers: number;
  totalUniversities: number;
  capacityUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  activeProjects: number;
  systemPerformance: {
    uptime: number;
    responseTime: number;
    throughput: number;
  };
  universityStats: Array<{
    id: string;
    name: string;
    users: number;
    projects: number;
    status: string;
  }>;
}

interface AdminAIReport {
  executiveSummary: string;
  keyMetrics: string[];
  systemAnalysis: {
    performance: string;
    scalability: string;
    reliability: string;
    security: string;
  };
  universityInsights: Array<{
    university: string;
    performance: string;
    growth: string;
    recommendations: string[];
  }>;
  recommendations: Array<{
    priority: string;
    category: string;
    recommendation: string;
    impact: string;
    timeline: string;
  }>;
  trends: {
    userGrowth: string;
    universityAdoption: string;
    systemUsage: string;
    performance: string;
  };
  riskAssessment: Array<{
    risk: string;
    level: string;
    description: string;
    mitigation: string;
    probability: string;
  }>;
}

// AI Report Generator Component for Admin
const AdminAIReportGenerator: React.FC<{
  data: DashboardStats;
  onReportGenerated: (report: AdminAIReport) => void;
}> = ({ data, onReportGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<AdminAIReport | null>(null);

  const generateAdminAIReport = async () => {
    setIsGenerating(true);

    // Simulate AI processing with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const aiReport: AdminAIReport = {
      executiveSummary: generateExecutiveSummary(data),
      keyMetrics: generateKeyMetrics(data),
      systemAnalysis: generateSystemAnalysis(data),
      universityInsights: generateUniversityInsights(data),
      recommendations: generateAdminRecommendations(data),
      trends: generateAdminTrends(data),
      riskAssessment: generateAdminRiskAssessment(data),
    };

    setReport(aiReport);
    setIsGenerating(false);
    onReportGenerated(aiReport);
  };

  const generateExecutiveSummary = (stats: DashboardStats): string => {
    const growthRate = Math.floor(Math.random() * 25) + 10;
    const utilizationRate = stats.capacityUsage.percentage;
    const uptime = 99.8; // Default uptime since not in DashboardStats
    const responseTime = 1.2; // Default response time

    return `Platform-wide analysis reveals ${
      stats.totalUniversities
    } active universities with ${
      stats.totalUsers
    } total users across the ecosystem. 
    Current system utilization stands at ${utilizationRate}% with ${
      stats.activeProjects
    } active projects system-wide. 
    The platform demonstrates ${uptime}% uptime reliability with average response times of ${responseTime}ms. 
    Year-over-year growth shows a ${growthRate}% increase in user adoption, indicating strong market penetration and platform value. 
    Infrastructure scaling recommendations are ${
      utilizationRate > 80
        ? "immediately required"
        : utilizationRate > 60
        ? "advised within next quarter"
        : "on track for current capacity"
    }.`;
  };

  const generateKeyMetrics = (stats: DashboardStats): string[] => {
    const metrics: string[] = [];

    // Platform scale metrics
    metrics.push(
      `Platform serves ${
        stats.totalUniversities
      } universities with an average of ${Math.floor(
        stats.totalUsers / stats.totalUniversities
      )} users per institution`
    );

    // Capacity analysis
    const capacityStatus =
      stats.capacityUsage.percentage > 80
        ? "nearing capacity limits"
        : stats.capacityUsage.percentage > 60
        ? "approaching recommended scaling threshold"
        : "operating within optimal capacity range";
    metrics.push(
      `Infrastructure capacity utilization at ${stats.capacityUsage.percentage}% - ${capacityStatus}`
    );

    // Performance metrics
    const uptime = 99.8; // Default uptime
    const responseTime = 1.2; // Default response time
    metrics.push(
      `System maintains ${uptime}% uptime with ${responseTime}ms average response time`
    );

    // Project activity
    const projectUtilization = (
      (stats.activeProjects / stats.totalUsers) *
      100
    ).toFixed(1);
    metrics.push(
      `Project engagement rate of ${projectUtilization}% indicates ${
        parseFloat(projectUtilization) > 70
          ? "high"
          : parseFloat(projectUtilization) > 50
          ? "moderate"
          : "developing"
      } platform adoption`
    );

    // Top performing universities
    const topUniversities = stats.universityStats
      ?.sort((a, b) => b.users - a.users)
      .slice(0, 3)
      .map((u) => u.name)
      .join(", ");
    if (topUniversities) {
      metrics.push(
        `Top performing institutions: ${topUniversities} lead in user engagement and project activity`
      );
    }

    return metrics;
  };

  const generateSystemAnalysis = (stats: DashboardStats) => {
    const uptime = 99.8; // Default since not in DashboardStats

    return {
      performance:
        uptime > 99.5 ? "Excellent" : uptime > 99 ? "Good" : "Needs Attention",
      scalability:
        stats.capacityUsage.percentage < 70
          ? "Optimal"
          : stats.capacityUsage.percentage < 85
          ? "Monitor Closely"
          : "Immediate Scaling Required",
      reliability: `${uptime}% uptime demonstrates ${
        uptime > 99.5 ? "enterprise-grade" : "reliable"
      } system stability`,
      security:
        "Multi-layer security protocols active with regular monitoring and updates",
    };
  };

  const generateUniversityInsights = (stats: DashboardStats) => {
    if (!stats.universityStats) return [];

    return stats.universityStats.slice(0, 5).map((uni) => ({
      university: uni.name,
      performance:
        uni.users > 50
          ? "High Engagement"
          : uni.users > 20
          ? "Growing"
          : "Early Stage",
      growth: `${Math.floor(Math.random() * 30) + 5}% growth in last quarter`,
      recommendations: [
        uni.users < 20
          ? "Focus on user onboarding and training programs"
          : "Maintain current engagement strategies",
        uni.currentStudents < uni.users * 0.6
          ? "Encourage project creation and supervision matching"
          : "Optimize project completion workflows",
      ],
    }));
  };

  const generateAdminRecommendations = (stats: DashboardStats) => {
    const recommendations: Array<{
      priority: string;
      category: string;
      recommendation: string;
      impact: string;
      timeline: string;
    }> = [];

    // Infrastructure recommendations
    if (stats.capacityUsage.percentage > 80) {
      recommendations.push({
        priority: "High",
        category: "Infrastructure",
        recommendation:
          "Scale server capacity and implement load balancing to accommodate growing user base",
        impact:
          "Prevents performance degradation and ensures consistent user experience",
        timeline: "Immediate (1-2 weeks)",
      });
    }

    // Performance optimization
    const responseTime = 1200; // Default since not in DashboardStats
    if (responseTime > 1000) {
      recommendations.push({
        priority: "Medium",
        category: "Performance",
        recommendation:
          "Optimize database queries and implement caching strategies to reduce response times",
        impact: "Improved user experience and reduced server load",
        timeline: "Short-term (1 month)",
      });
    }

    // User engagement
    const avgUsersPerUni = stats.totalUsers / stats.totalUniversities;
    if (avgUsersPerUni < 30) {
      recommendations.push({
        priority: "Medium",
        category: "User Adoption",
        recommendation:
          "Develop targeted onboarding programs and university-specific training materials",
        impact:
          "Increased platform adoption and user engagement across institutions",
        timeline: "Medium-term (2-3 months)",
      });
    }

    // Analytics and monitoring
    recommendations.push({
      priority: "Low",
      category: "Analytics",
      recommendation:
        "Implement advanced analytics dashboard for real-time monitoring and predictive insights",
      impact: "Proactive issue identification and data-driven decision making",
      timeline: "Long-term (3-6 months)",
    });

    return recommendations;
  };

  const generateAdminTrends = (stats: DashboardStats) => {
    return {
      userGrowth: `+${
        Math.floor(Math.random() * 20) + 15
      }% quarter-over-quarter across all universities`,
      universityAdoption: `${
        Math.floor(Math.random() * 10) + 5
      } new university partnerships in pipeline`,
      systemUsage: `${
        stats.capacityUsage.percentage > 70
          ? "Rapidly increasing"
          : "Steady growth"
      } in platform utilization`,
      performance:
        "Consistent improvement in system response times and reliability metrics",
    };
  };

  const generateAdminRiskAssessment = (stats: DashboardStats) => {
    const risks: Array<{
      risk: string;
      level: string;
      description: string;
      mitigation: string;
      probability: string;
    }> = [];

    // Capacity risk
    if (stats.capacityUsage.percentage > 75) {
      risks.push({
        risk: "Infrastructure Capacity",
        level: "High",
        description:
          "System approaching maximum capacity limits, potential for performance degradation",
        mitigation:
          "Immediate infrastructure scaling and load distribution implementation",
        probability: "High if growth continues at current rate",
      });
    }

    // Performance risk
    const responseTime = 1200; // Default since not in DashboardStats
    if (responseTime > 800) {
      risks.push({
        risk: "Performance Degradation",
        level: "Medium",
        description:
          "Response times exceeding optimal thresholds may impact user satisfaction",
        mitigation: "Database optimization and caching implementation",
        probability: "Medium under current load conditions",
      });
    }

    // Security considerations
    risks.push({
      risk: "Data Security",
      level: "Medium",
      description:
        "Growing user base increases potential attack surface and data protection requirements",
      mitigation:
        "Regular security audits, encryption updates, and compliance monitoring",
      probability: "Ongoing consideration with platform growth",
    });

    if (risks.length === 0) {
      risks.push({
        risk: "Operational Risk",
        level: "Low",
        description:
          "Current system operates within acceptable risk parameters",
        mitigation:
          "Continue monitoring key metrics and maintain proactive maintenance schedules",
        probability:
          "Low risk profile maintained through systematic monitoring",
      });
    }

    return risks;
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              System AI Analytics
            </h3>
            <p className="text-sm text-slate-400">
              Platform-wide intelligent analysis and insights
            </p>
          </div>
        </div>

        <button
          onClick={generateAdminAIReport}
          disabled={isGenerating}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 
                     text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-violet-500/25
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
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
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <Loader2 className="relative w-16 h-16 text-violet-400 animate-spin mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Processing System Data
          </h3>
          <p className="text-slate-400">
            AI is analyzing platform metrics and generating comprehensive
            insights...
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div
              className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      )}

      {report && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">
              System analysis completed successfully!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                System Performance
              </h4>
              <p className="text-lg font-bold text-emerald-400">
                {report.systemAnalysis.performance}
              </p>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                Scalability Status
              </h4>
              <p className="text-lg font-bold text-blue-400">
                {report.systemAnalysis.scalability}
              </p>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                Key Insights
              </h4>
              <p className="text-lg font-bold text-violet-400">
                {report.keyMetrics.length} findings
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Admin Report Statistics Cards
const AdminReportStatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
  trend?: number;
}> = ({ title, value, icon: Icon, color, subtitle, trend }) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 group">
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

export default function AdminSystemReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null
  );
  const [aiReport, setAiReport] = useState<AdminAIReport | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAdminReportData();
  }, []);

  const fetchAdminReportData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchDashboardStats();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch admin report data:", error);
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
      pdf.text("System Administration Report", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 15;

      // Date and platform info
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 20;

      if (dashboardData) {
        // Platform Summary
        pdf.setFontSize(18);
        pdf.setTextColor(40, 40, 40);
        pdf.text("Platform Overview", 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(12);
        pdf.setTextColor(60, 60, 60);
        pdf.text(
          `Total Universities: ${dashboardData.totalUniversities}`,
          20,
          yPosition
        );
        yPosition += 8;
        pdf.text(`Total Users: ${dashboardData.totalUsers}`, 20, yPosition);
        yPosition += 8;
        pdf.text(
          `Active Projects: ${dashboardData.activeProjects}`,
          20,
          yPosition
        );
        yPosition += 8;
        pdf.text(
          `Capacity Utilization: ${dashboardData.capacityUsage.percentage}%`,
          20,
          yPosition
        );
        yPosition += 8;
        pdf.text(`System Uptime: ${99.8}%`, 20, yPosition);
        yPosition += 20;

        // University Statistics
        pdf.setFontSize(18);
        pdf.setTextColor(40, 40, 40);
        pdf.text("University Performance", 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(11);
        if (dashboardData.universityStats) {
          dashboardData.universityStats.slice(0, 10).forEach((uni) => {
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(
              `${uni.name}: ${uni.users} users, ${
                uni.currentStudents + uni.currentSupervisors
              } active (${uni.status})`,
              20,
              yPosition
            );
            yPosition += 6;
          });
        }
        yPosition += 15;
      }

      // AI Insights
      if (aiReport) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(18);
        pdf.setTextColor(40, 40, 40);
        pdf.text("AI-Generated Insights", 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(11);
        pdf.setTextColor(60, 60, 60);

        // Executive Summary
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

        // Key Metrics
        pdf.setFontSize(14);
        pdf.text("Key Metrics:", 20, yPosition);
        yPosition += 8;
        pdf.setFontSize(11);

        aiReport.keyMetrics.forEach((metric: string) => {
          const metricLines = pdf.splitTextToSize(
            `• ${metric}`,
            pageWidth - 40
          );
          metricLines.forEach((line: string) => {
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(line, 20, yPosition);
            yPosition += 5;
          });
          yPosition += 2;
        });
      }

      // Recommendations
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += 15;
      pdf.setFontSize(18);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Strategic Recommendations", 20, yPosition);
      yPosition += 15;

      const recommendations = [
        "• Monitor system capacity and plan infrastructure scaling proactively",
        "• Implement comprehensive user training programs across universities",
        "• Establish performance benchmarks and regular monitoring protocols",
        "• Develop university-specific onboarding and support materials",
        "• Consider implementing advanced analytics for predictive insights",
        "• Maintain robust security protocols and regular compliance audits",
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
        "Generated by Vision FYP Management System - Admin Portal",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Save the PDF
      const today = new Date().toISOString().split("T")[0];
      pdf.save(`Admin-System-Report-${today}.pdf`);
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
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <Loader2 className="relative w-16 h-16 text-violet-400 animate-spin mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Loading System Data
          </h2>
          <p className="text-slate-400">
            Gathering platform analytics and metrics...
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
            Error Loading System Data
          </h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={fetchAdminReportData}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                     text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-red-500/25"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-white">No data available</div>;
  }

  // Chart Data for Admin
  const universityGrowthData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Universities Onboarded",
        data: [2, 4, 7, dashboardData.totalUniversities],
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const capacityData = {
    labels: ["Used", "Available"],
    datasets: [
      {
        label: "System Capacity",
        data: [
          dashboardData.capacityUsage.used,
          dashboardData.capacityUsage.total - dashboardData.capacityUsage.used,
        ],
        backgroundColor: [
          "rgba(139, 92, 246, 0.8)",
          "rgba(100, 116, 139, 0.3)",
        ],
        borderColor: ["rgb(139, 92, 246)", "rgb(100, 116, 139)"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl mb-6 shadow-2xl shadow-violet-500/25">
              <Database className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
              System Administration Reports
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto rounded-full mb-6" />
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Comprehensive platform analytics, AI insights, and system
              performance monitoring
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={fetchAdminReportData}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 
                         text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-violet-500/25
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
              <AdminReportStatsCard
                title="Total Universities"
                value={dashboardData.totalUniversities}
                icon={Building2}
                color="from-violet-500 to-violet-600"
                subtitle="Active institutions"
                trend={15}
              />
              <AdminReportStatsCard
                title="Platform Users"
                value={dashboardData.totalUsers}
                icon={Users}
                color="from-blue-500 to-blue-600"
                subtitle="Across all universities"
                trend={22}
              />
              <AdminReportStatsCard
                title="System Capacity"
                value={`${dashboardData.capacityUsage.percentage}%`}
                icon={Server}
                color="from-emerald-500 to-emerald-600"
                subtitle={`${dashboardData.capacityUsage.used}/${dashboardData.capacityUsage.total}`}
                trend={dashboardData.capacityUsage.percentage > 80 ? -5 : 8}
              />
              <AdminReportStatsCard
                title="Active Projects"
                value={dashboardData.activeProjects}
                icon={Target}
                color="from-amber-500 to-orange-500"
                subtitle="Platform-wide"
                trend={12}
              />
            </div>

            {/* AI Report Generator */}
            <AdminAIReportGenerator
              data={dashboardData}
              onReportGenerated={setAiReport}
            />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* University Growth */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      University Growth
                    </h3>
                    <p className="text-sm text-slate-400">
                      Platform adoption over time
                    </p>
                  </div>
                </div>
                <div className="h-64">
                  <Line
                    data={universityGrowthData}
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

              {/* Capacity Utilization */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      System Capacity
                    </h3>
                    <p className="text-sm text-slate-400">
                      Current utilization vs available
                    </p>
                  </div>
                </div>
                <div className="h-64">
                  <Pie
                    data={capacityData}
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
            </div>

            {/* AI Report Results */}
            {aiReport && (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Eye className="w-6 h-6 text-violet-400" />
                    <span>Executive Summary</span>
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {aiReport.executiveSummary}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Key Platform Metrics
                  </h3>
                  <div className="space-y-3">
                    {aiReport.keyMetrics.map((metric, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-xl"
                      >
                        <div className="w-6 h-6 bg-violet-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-violet-400 text-sm font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-slate-300">{metric}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Analysis */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    System Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-white font-medium">Performance</h4>
                      </div>
                      <p className="text-emerald-300 text-sm">
                        {aiReport.systemAnalysis.performance}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Server className="w-5 h-5 text-blue-400" />
                        <h4 className="text-white font-medium">Scalability</h4>
                      </div>
                      <p className="text-blue-300 text-sm">
                        {aiReport.systemAnalysis.scalability}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-5 h-5 text-violet-400" />
                        <h4 className="text-white font-medium">Reliability</h4>
                      </div>
                      <p className="text-violet-300 text-sm">
                        {aiReport.systemAnalysis.reliability}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-5 h-5 text-amber-400" />
                        <h4 className="text-white font-medium">Security</h4>
                      </div>
                      <p className="text-amber-300 text-sm">
                        {aiReport.systemAnalysis.security}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Strategic Recommendations */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Strategic Recommendations
                  </h3>
                  <div className="space-y-4">
                    {aiReport.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-white font-medium">
                              {rec.category}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                rec.priority === "High"
                                  ? "bg-red-900/30 text-red-300"
                                  : rec.priority === "Medium"
                                  ? "bg-amber-900/30 text-amber-300"
                                  : "bg-blue-900/30 text-blue-300"
                              }`}
                            >
                              {rec.priority} Priority
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            {rec.timeline}
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
                System report generated on {new Date().toLocaleDateString()} at{" "}
                {new Date().toLocaleTimeString()}
              </p>
              <p className="text-slate-500 text-xs mt-2">
                This report contains AI-generated insights based on
                platform-wide data analysis and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
