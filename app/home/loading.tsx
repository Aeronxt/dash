export default function HomeLoading() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 bg-gray-800 rounded-lg w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-64 animate-pulse"></div>
          </div>
        </div>

        {/* Welcome Card Skeleton */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
            <div>
              <div className="h-6 bg-gray-800 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded w-64 animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-gray-800/30 rounded-lg p-4">
                <div className="h-5 bg-gray-800 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-800 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 bg-gray-800 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-5 bg-gray-800 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 