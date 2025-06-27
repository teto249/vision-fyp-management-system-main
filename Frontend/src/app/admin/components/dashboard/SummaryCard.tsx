interface SummaryCardProps {
  title: string;
  value: number | string;
  change?: number;
  subtitle?: string;
}

export default function SummaryCard({ title, value, change, subtitle }: SummaryCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-semibold text-gray-200">{value}</p>
        {change && (
          <span
            className={`ml-2 text-sm font-medium ${
              change > 0 ? "text-primary-500" : "text-status-critical"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
      )}
    </div>
  );
}