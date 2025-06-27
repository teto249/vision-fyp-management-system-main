"use client";
import SummaryCard from "./components/dashboard/SummaryCard";
import LineChart from "./components/dashboard/LineChart";
import DonutChart from "./components/dashboard/DountChart";
import UniversityTable from "./components/dashboard/UniversityTable";
import PerformancePanel from "./components/dashboard/PerformancePanel";
import { fetchDashboardStats } from "../../api/admin/dashboard";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="p-12 bg-gray-800 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 bg-gray-800 min-h-screen flex justify-center items-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-400">Error Loading Dashboard</h3>
          </div>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 bg-gray-800 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <SummaryCard 
          title="Total Users" 
          value={dashboardData.totalUsers} 
          change={Math.floor(Math.random() * 20 - 10)} // Random change for demo
        />
        <SummaryCard 
          title="Total Universities" 
          value={dashboardData.totalUniversities} 
        />
        <SummaryCard 
          title="Capacity Usage" 
          value={`${dashboardData.capacityUsage.used}/${dashboardData.capacityUsage.total}`}
          subtitle={`${dashboardData.capacityUsage.percentage}% utilized`}
        />
        <SummaryCard 
          title="Active Projects" 
          value={dashboardData.activeProjects} 
          change={Math.floor(Math.random() * 10 - 5)} // Random change for demo
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LineChart data={dashboardData} />
        <DonutChart data={dashboardData} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <UniversityTable data={dashboardData.universityStats} />
        <PerformancePanel data={dashboardData} />
      </div>
    </div>
  );
}
