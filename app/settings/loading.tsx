export default function SettingsLoading() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 bg-gray-800 rounded-lg w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-80 animate-pulse"></div>
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <div className="h-10 bg-gray-800 rounded-lg max-w-md animate-pulse"></div>
        </div>

        {/* Settings Sections Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg animate-pulse"></div>
                  <div>
                    <div className="h-5 bg-gray-800 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded w-64 mb-2 animate-pulse"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-800 rounded-full w-20 animate-pulse"></div>
                      <div className="h-6 bg-gray-800 rounded-full w-24 animate-pulse"></div>
                      <div className="h-6 bg-gray-800 rounded-full w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="w-5 h-5 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 