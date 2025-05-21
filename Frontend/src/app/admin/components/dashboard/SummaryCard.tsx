interface SummaryCardProps {
  title: string;
  value: number | string;
  change?: number;
}

export default function SummaryCard({ title, value, change }: SummaryCardProps) {
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
    </div>
  );
}