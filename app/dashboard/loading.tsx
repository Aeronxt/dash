export default function DashboardLoading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Welcome Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-800 rounded-lg w-80 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-800 rounded w-64 animate-pulse"></div>
      </div>

      {/* Progress Overview Skeleton */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-800 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-5 bg-gray-800 rounded w-32 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded w-40 animate-pulse"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-800 rounded-full w-20 animate-pulse"></div>
        </div>
        <div className="h-2 bg-gray-800 rounded-full w-full animate-pulse"></div>
      </div>

      {/* Steps Skeleton */}
      <div className="space-y-4">
        {[1, 2].map((index) => (
          <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg animate-pulse"></div>
                <div>
                  <div className="h-5 bg-gray-800 rounded w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-800 rounded w-80 animate-pulse"></div>
                </div>
              </div>
              <div className="h-9 bg-gray-800 rounded-lg w-28 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 