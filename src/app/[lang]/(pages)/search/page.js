import React from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { getPaginationInfo } from "@/core/repo";
import ArticlesGrid from "../article-category/ArticlesGrid";

const SearchPage = async ({ params, searchParams }) => {
  const lang = params.lang || "ar";
  const query = searchParams.q || "";
  const currentPage = parseInt(searchParams.page) || 1;
  const limit = 12; // Articles per page

  let articlesData = null;
  let error = null;

  if (!query) {
    return (
      <div className="container mx-auto px-4 pb-[70px]">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            {lang === "ar" ? "أدخل كلمة البحث" : "Enter search query"}
          </h1>
          <p className="text-gray-500">
            {lang === "ar"
              ? "يرجى إدخال كلمة البحث للعثور على المقالات."
              : "Please enter a search query to find articles."}
          </p>
        </div>
      </div>
    );
  }

  try {
    // Get the host from headers to construct the full URL
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    // Fetch articles from search API route
    const apiUrl = `${baseUrl}/api/search?titleQuery=${encodeURIComponent(
      query
    )}&page=${currentPage}&pageSize=${limit}&locale=${lang}`;
    const response = await fetch(apiUrl, {
      cache: "no-store", // Always fetch fresh results for search
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    articlesData = await response.json();
  } catch (err) {
    console.error("Error fetching search results:", err);
    error = err;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pb-[70px]">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {lang === "ar" ? "خطأ في البحث" : "Search Error"}
          </h1>
          <p className="text-gray-600">
            {lang === "ar"
              ? "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى."
              : "An error occurred while searching. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  // Handle different possible response structures from Strapi v4
  let articles = [];
  let paginationMeta = null;

  if (Array.isArray(articlesData)) {
    articles = articlesData;
  } else if (articlesData?.data && Array.isArray(articlesData.data)) {
    articles = articlesData.data;
    paginationMeta = articlesData.meta?.pagination;
  } else if (
    articlesData?.data?.data &&
    Array.isArray(articlesData.data.data)
  ) {
    articles = articlesData.data.data;
    paginationMeta = articlesData.data.meta?.pagination;
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="container mx-auto px-4 pb-[70px]">
        <h1 className="text-black ms-5 mb-4 text-3xl font-bold pb-[14px] pt-[50px] ltr:text-left rtl:text-right">
          {lang === "ar"
            ? `نتائج البحث عن: "${query}"`
            : `Search results for: "${query}"`}
        </h1>
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">
            {lang === "ar" ? "لم يتم العثور على مقالات." : "No articles found."}
          </p>
        </div>
      </div>
    );
  }

  // Calculate pagination from API metadata
  const paginationInfo = getPaginationInfo(paginationMeta, currentPage, limit);

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <h1 className="text-black ms-5 mb-4 text-3xl font-bold pb-[14px] pt-[50px] ltr:text-left rtl:text-right">
        {lang === "ar"
          ? `نتائج البحث عن: "${query}"`
          : `Search results for: "${query}"`}
      </h1>

      <ArticlesGrid articles={articles} lang={lang} />

      {paginationInfo.pageCount > 1 && (
        <SearchPagination
          currentPage={paginationInfo.current}
          totalPages={paginationInfo.pageCount}
          query={query}
          lang={lang}
        />
      )}
    </div>
  );
};

// Search-specific pagination component
const SearchPagination = ({ currentPage, totalPages, query, lang }) => {
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
    return `/${lang}/search?q=${encodeURIComponent(query)}&page=${page}`;
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

export default SearchPage;
