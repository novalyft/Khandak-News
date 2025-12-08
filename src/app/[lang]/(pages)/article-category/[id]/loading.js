const ArticleCategoryLoading = () => {
  return (
    <div className="container mx-auto px-4 pb-[70px]">
      {/* Category Header Skeleton */}
      <div className="ms-5 mb-4 pb-[14px] pt-[50px]">
        <div className="h-9 w-64 bg-gray-300 rounded animate-pulse"></div>
      </div>

      {/* Articles Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="block rounded overflow-hidden shadow-lg animate-pulse"
          >
            <div className="relative">
              {/* Image Skeleton */}
              <div className="w-full h-[300px] bg-gray-300"></div>
              
              {/* Overlay Content Skeleton */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Title Skeleton */}
                <div className="mb-2 space-y-2">
                  <div className="h-5 bg-gray-400 rounded w-full"></div>
                  <div className="h-5 bg-gray-400 rounded w-3/4"></div>
                </div>
                
                {/* Metadata Skeleton */}
                <div className="flex items-center text-gray-300 text-sm space-x-4 rtl:space-x-reverse mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <div className="h-4 bg-gray-400 rounded w-20"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <div className="h-4 bg-gray-400 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleCategoryLoading;



