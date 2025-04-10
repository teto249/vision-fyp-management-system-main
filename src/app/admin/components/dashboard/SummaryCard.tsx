// app/components/dashboard/SummaryCard.tsx
interface SummaryCardProps {
  title: string;
  value: number | string;
  change?: number; // percentage change
}

export default function SummaryCard({
  title,
  value,
  change,
}: SummaryCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-4xl border border-gray-400">
      <h3 className="text-gray-200 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-semibold text-gray-300">{value}</p>
        {change && (
          <span
            className={`ml-2 text-sm font-medium ${
              change > 0 ? "text-green-600" : "text-red-600"
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
