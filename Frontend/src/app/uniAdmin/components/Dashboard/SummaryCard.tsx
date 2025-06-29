import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number | string;
  change?: number;
}

export default function SummaryCard({
  title,
  value,
  change,
}: SummaryCardProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider">
            {title}
          </h3>
          {change && (
            <div
              className={`flex items-center space-x-1 text-sm font-medium ${
                change > 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {change > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            </div>
          )}
        </div>

        <div className="flex items-baseline space-x-2">
          <p className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent group-hover:from-teal-300 group-hover:to-blue-300 transition-all duration-300">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
