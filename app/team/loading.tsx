export default function TeamLoading() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 bg-gray-800 rounded-lg w-24 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-72 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-800 rounded-lg w-36 animate-pulse"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 bg-gray-800 rounded-lg flex-1 max-w-md animate-pulse"></div>
          <div className="h-10 bg-gray-800 rounded-lg w-20 animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-16">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-800 rounded w-44 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-96 mb-6 animate-pulse"></div>
            <div className="h-10 bg-gray-800 rounded-lg w-52 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 