const HomepageLoading = () => {
  return (
    <main className="bg-white">
      {/* Hero Section Skeleton */}
      <div className="animate-pulse">
        {/* Hero Banner */}
        <div className="w-full relative bg-gray-300 min-h-[400px]">
          {/* Overlay Box Skeleton */}
          <div className="absolute bottom-5 right-5 bg-gray-400/60 p-4 max-w-sm">
            <div className="h-6 bg-gray-500 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-500 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-500 rounded mb-2 w-5/6"></div>
            <div className="h-4 bg-gray-500 rounded w-20"></div>
          </div>
        </div>

        {/* Article Selection List Skeleton */}
        <div className="flex flex-col md:flex-row border border-gray-400 bg-white">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className={`w-full md:w-1/3 p-4 bg-gray-100 ${
                idx !== 2 ? "border-l border-gray-400" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="min-h-[80px] w-24 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LocalNewsSection Skeleton (First Instance) */}
      <section className="max-w-6xl mx-auto px-4 py-6 pb-[70px] animate-pulse">
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="w-full md:w-1/2 md:pe-6 border-gray-300 md:border-e">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4 ms-5"></div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-4">
                <div className="flex gap-4">
                  <div className="w-1/3 min-h-[130px] bg-gray-300 rounded"></div>
                  <div className="flex flex-col justify-end flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="flex gap-4 mt-2">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 md:ps-6 mt-10 md:mt-0">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4 ms-5"></div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-4">
                <div className="flex gap-4">
                  <div className="w-1/3 min-h-[130px] bg-gray-300 rounded"></div>
                  <div className="flex flex-col justify-end flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="flex gap-4 mt-2">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VideoSection Skeleton */}
      <section className="w-full bg-black py-10 mt-10 animate-pulse">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-8 bg-gray-700 rounded w-32 mb-6"></div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Video Skeleton */}
            <div className="w-full lg:w-1/2">
              <div className="w-full h-[380px] bg-gray-800 rounded"></div>
            </div>

            {/* Side Thumbnails Skeleton */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-3 bg-gray-800 rounded-md"
                >
                  <div className="w-24 h-20 bg-gray-700 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-20 mt-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View More Button Skeleton */}
          <div className="text-center mt-8">
            <div className="inline-block bg-gray-700 h-10 w-32 rounded"></div>
          </div>
        </div>
      </section>

      {/* LocalNewsSection Skeleton (Second Instance) */}
      <section className="max-w-6xl mx-auto px-4 py-6 pb-[70px] animate-pulse">
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="w-full md:w-1/2 md:pe-6 border-gray-300 md:border-e">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4 ms-5"></div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-4">
                <div className="flex gap-4">
                  <div className="w-1/3 min-h-[130px] bg-gray-300 rounded"></div>
                  <div className="flex flex-col justify-end flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="flex gap-4 mt-2">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 md:ps-6 mt-10 md:mt-0">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4 ms-5"></div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-4">
                <div className="flex gap-4">
                  <div className="w-1/3 min-h-[130px] bg-gray-300 rounded"></div>
                  <div className="flex flex-col justify-end flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="flex gap-4 mt-2">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* InfographicsSection Skeleton (First Instance) */}
      <section className="w-full bg-black py-12 mt-10 animate-pulse">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-9 bg-gray-700 rounded w-40 mb-6"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="w-full">
                <div className="relative overflow-hidden rounded">
                  <div className="w-full h-[380px] bg-gray-800"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-4">
                    <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button Skeleton */}
          <div className="text-center mt-10">
            <div className="inline-block bg-gray-700 h-10 w-32 rounded"></div>
          </div>
        </div>
      </section>

      {/* LocalNewsSection Skeleton (Third Instance) */}
      <section className="max-w-6xl mx-auto px-4 py-6 pb-[70px] animate-pulse">
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="w-full md:w-1/2 md:pe-6 border-gray-300 md:border-e">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4 ms-5"></div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-4">
                <div className="flex gap-4">
                  <div className="w-1/3 min-h-[130px] bg-gray-300 rounded"></div>
                  <div className="flex flex-col justify-end flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="flex gap-4 mt-2">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 md:ps-6 mt-10 md:mt-0">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4 ms-5"></div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-4">
                <div className="flex gap-4">
                  <div className="w-1/3 min-h-[130px] bg-gray-300 rounded"></div>
                  <div className="flex flex-col justify-end flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="flex gap-4 mt-2">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* InfographicsSection Skeleton (Second Instance) */}
      <section className="w-full bg-black py-12 mt-10 animate-pulse">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-9 bg-gray-700 rounded w-40 mb-6"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="w-full">
                <div className="relative overflow-hidden rounded">
                  <div className="w-full h-[380px] bg-gray-800"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-4">
                    <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button Skeleton */}
          <div className="text-center mt-10">
            <div className="inline-block bg-gray-700 h-10 w-32 rounded"></div>
          </div>
        </div>
      </section>

      {/* LocalNewsSection Skeleton (Fourth Instance - Africa & Sports) */}
      <section className="max-w-6xl mx-auto px-4 py-6 pb-[70px] animate-pulse">
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="w-full md:w-1/2 md:pe-6 border-gray-300 md:border-e">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4 ms-5"></div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-4">
                <div className="flex gap-4">
                  <div className="w-1/3 min-h-[130px] bg-gray-300 rounded"></div>
                  <div className="flex flex-col justify-end flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="flex gap-4 mt-2">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 md:ps-6 mt-10 md:mt-0">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4 ms-5"></div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-4">
                <div className="flex gap-4">
                  <div className="w-1/3 min-h-[130px] bg-gray-300 rounded"></div>
                  <div className="flex flex-col justify-end flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="flex gap-4 mt-2">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomepageLoading;

