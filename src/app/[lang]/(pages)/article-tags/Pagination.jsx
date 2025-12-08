import Link from "next/link";

const Pagination = ({ currentPage, totalPages, categoryId, lang, basePath }) => {
  const buildWindow = () => {
    const windowSize = 2;
    const pages = new Set([1, totalPages]);
    for (let p = currentPage - windowSize; p <= currentPage + windowSize; p++) {
      if (p >= 1 && p <= totalPages) pages.add(p);
    }
    return Array.from(pages).sort((a, b) => a - b);
  };
  const pages = buildWindow();

  const getPageUrl = (page) => {
    // Use basePath if provided, otherwise default to article-category
    if (basePath) {
      return `${basePath}?page=${page}`;
    }
    return `/${lang}/article-category/${categoryId}?page=${page}`;
  };

  return (
    <div className="flex justify-center mt-8">
      <ul className="flex items-center gap-2">
        {/* Previous Button */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={getPageUrl(currentPage - 1)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 text-white hover:bg-red-600"
              aria-label="Previous page"
            >
              <svg
                className="w-4 h-4 rtl:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
          ) : (
            <button
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-700 text-gray-400 cursor-not-allowed"
              disabled
              aria-label="Previous page"
            >
              <svg
                className="w-4 h-4 rtl:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
        </li>

        {/* Page Numbers with Ellipsis */}
        {pages.map((page, idx) => {
          const prev = pages[idx - 1];
          const showEllipsis = prev && page - prev > 1;
          return (
            <li key={page}>
              {showEllipsis && <span className="px-2">…</span>}
              {page === currentPage ? (
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-red-500 text-white">
                  {page}
                </span>
              ) : (
                <Link
                  href={getPageUrl(page)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 text-white hover:bg-red-600"
                  aria-label={`Page ${page}`}
                >
                  {page}
                </Link>
              )}
            </li>
          );
        })}

        {/* Next Button */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={getPageUrl(currentPage + 1)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 text-white hover:bg-red-600"
              aria-label="Next page"
            >
              <svg
                className="w-4 h-4 rtl:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          ) : (
            <button
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-700 text-gray-400 cursor-not-allowed"
              disabled
              aria-label="Next page"
            >
              <svg
                className="w-4 h-4 rtl:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
