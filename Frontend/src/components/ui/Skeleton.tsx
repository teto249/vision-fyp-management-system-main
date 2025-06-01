export function DocumentSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gray-700 rounded-lg w-14 h-14" />
        <div className="flex-1">
          <div className="h-6 bg-gray-700 rounded w-3/4" />
          <div className="mt-2 h-4 bg-gray-700 rounded w-1/2" />
          <div className="mt-4 flex gap-2">
            <div className="h-5 bg-gray-700 rounded w-16" />
            <div className="h-5 bg-gray-700 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}