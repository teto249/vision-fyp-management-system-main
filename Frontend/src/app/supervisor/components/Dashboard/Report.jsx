"use client";
import React, { useState, useEffect } from "react";
import { BarChart, Brain, Download, RefreshCw, TrendingUp, Users, CheckCircle, AlertTriangle } from "lucide-react";
import { generateAIReport, generateQuickSummary } from "../../../../api/SupervisorApi/AIReports";

export default function Report({ students = [] }) {
  const [aiReport, setAiReport] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate quick summary when component mounts or students change
  useEffect(() => {
    const quickSummary = generateQuickSummary(students);
    setSummary(quickSummary);
  }, [students]);

  const handleGenerateAIReport = async () => {
    if (!students.length) {
      setError("No student data available to generate report");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await generateAIReport(students);
      
      if (response.success) {
        setAiReport(response.report || "AI report generated successfully");
        if (response.summary) {
          setSummary(response.summary);
        }
      } else {
        setError(response.message || "Failed to generate AI report");
      }
    } catch (err) {
      setError(err.message || "An error occurred while generating the report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!aiReport && !summary) return;

    const reportContent = `
STUDENT SUPERVISION REPORT
Generated on: ${new Date().toLocaleDateString()}

SUMMARY:
- Total Students: ${summary?.totalStudents || 0}
- Average Progress: ${summary?.averageProgress || 0}%
- Completed Tasks: ${summary?.completedTasks || 0}/${summary?.totalTasks || 0}
- Task Completion Rate: ${summary?.totalTasks > 0 ? Math.round((summary.completedTasks / summary.totalTasks) * 100) : 0}%

RECOMMENDATIONS:
${summary?.recommendations?.map(rec => `• ${rec}`).join('\n') || 'No recommendations available'}

${aiReport ? `\nDETAILED AI ANALYSIS:\n${aiReport}` : ''}

STUDENT DETAILS:
${students.map(student => `
Student: ${student.name}
Progress: ${student.progress}%
Tasks: ${student.assignments.filter(a => a.status === 'completed').length}/${student.assignments.length} completed
Course: ${student.course}
Level: ${student.level}
`).join('\n')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supervision-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-teal-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total Students
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-100">
                      {summary.totalStudents}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Avg Progress
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-100">
                      {summary.averageProgress}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Tasks Completed
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-100">
                      {summary.completedTasks}/{summary.totalTasks}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Completion Rate
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-100">
                      {summary.totalTasks > 0 ? Math.round((summary.completedTasks / summary.totalTasks) * 100) : 0}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Report Section */}
      <div className="bg-gray-700 shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-600 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-teal-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-100">
              AI-Powered Analysis Report
            </h3>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleGenerateAIReport}
              disabled={loading || !students.length}
              className="bg-teal-400 text-gray-900 px-4 py-2 rounded-md hover:bg-teal-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              {loading ? "Generating..." : "Generate AI Report"}
            </button>
            <button
              onClick={handleDownloadReport}
              disabled={!summary && !aiReport}
              className="bg-gray-600 text-gray-100 px-4 py-2 rounded-md hover:bg-gray-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <div className="text-red-300">{error}</div>
              </div>
            </div>
          )}

          {!students.length ? (
            <div className="text-center py-8">
              <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Student Data Available</h3>
              <p className="text-gray-400">
                Assign students to projects to generate AI-powered insights and recommendations.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recommendations */}
              {summary?.recommendations && (
                <div>
                  <h4 className="text-md font-medium text-gray-200 mb-3">Key Recommendations</h4>
                  <div className="space-y-2">
                    {summary.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3"></div>
                        <p className="text-gray-300 text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Report */}
              {aiReport ? (
                <div>
                  <h4 className="text-md font-medium text-gray-200 mb-3">Detailed AI Analysis</h4>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                      {aiReport}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <Brain className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                  <p className="text-gray-400">
                    Click "Generate AI Report" to get detailed insights about your students' progress
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
