export default function RegionLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
      
      {/* List Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}