// app/components/dashboard/PerformancePanel.tsx
import { Activity, Cpu, Signal, Clock, CheckCircle, TrendingUp } from 'lucide-react';

export default function PerformancePanel() {
  const metrics = [
    {
      icon: Clock,
      value: "1.2s",
      label: "Avg Response Time",
      color: "from-blue-500 to-blue-600",
      change: "-15%",
      trend: "down"
    },
    {
      icon: Signal,
      value: "427",
      label: "Active Sessions",
      color: "from-emerald-500 to-emerald-600",
      change: "+12%",
      trend: "up"
    },
    {
      icon: CheckCircle,
      value: "99.9%",
      label: "System Uptime",
      color: "from-teal-500 to-teal-600",
      change: "+0.1%",
      trend: "up"
    },
    {
      icon: Cpu,
      value: "45%",
      label: "Server Load",
      color: "from-purple-500 to-purple-600",
      change: "-8%",
      trend: "down"
    }
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl mb-12">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">System Performance</h3>
          <p className="text-sm text-slate-400">Real-time system metrics and analytics</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-emerald-400' : 'text-blue-400'
              }`}>
                <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                <span>{metric.change}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-slate-400 text-sm">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}