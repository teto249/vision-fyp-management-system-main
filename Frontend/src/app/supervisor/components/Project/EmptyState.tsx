interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  message: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  message,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
      <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
