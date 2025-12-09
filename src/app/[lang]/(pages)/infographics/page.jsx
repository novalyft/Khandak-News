"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useSearchParams,
  useRouter,
  usePathname,
  useParams,
} from "next/navigation";
import { getCoverImageUrl } from "@/core/imageUtils";

export default function Infographics() {
  const { t, ready, i18n } = useTranslation("common");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const lang = params?.lang || (i18n.language?.startsWith("en") ? "en" : "ar");

  const [infographics, setInfographics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = 12;

  useEffect(() => {
    const fetchInfographics = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: pageSize.toString(),
          locale: lang,
        });

        const response = await fetch(`/api/infographs?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch infographics: ${response.status}`);
        }

        const data = await response.json();

        // Transform the data to match the expected format
        const transformedInfographics =
          data.data?.map((infograph) => ({
            id: infograph.id,
            title: infograph.title || "",
            url: getCoverImageUrl(infograph.coverImage) || "",
            image: getCoverImageUrl(infograph.coverImage) || "",
          })) || [];

        setInfographics(transformedInfographics);

        // Update pagination info
        const paginationMeta = data.meta?.pagination || {};
        setPagination({
          currentPage: paginationMeta.page || currentPage,
          totalPages: paginationMeta.pageCount || 1,
          hasNext: paginationMeta.page < paginationMeta.pageCount,
          hasPrev: paginationMeta.page > 1,
        });
      } catch (err) {
        console.error("Error fetching infographics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (ready) {
      fetchInfographics();
    }
  }, [currentPage, lang, ready]);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (!ready) return null;

  // Only the page title translates
  const title = t("cat.infographics", {
    defaultValue: i18n.language?.startsWith("en")
      ? "Infographics"
      : "إنفوغرافيك",
  });

  // Build pagination pages array
  const buildPages = () => {
    const windowSize = 2;
    const pages = new Set([1, pagination.totalPages]);
    for (
      let p = pagination.currentPage - windowSize;
      p <= pagination.currentPage + windowSize;
      p++
    ) {
      if (p >= 1 && p <= pagination.totalPages) pages.add(p);
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const pages = buildPages();

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <h1 className="text-black ms-5 mb-4 text-3xl font-bold pb-[14px] pt-[50px] ltr:text-left rtl:text-right">
        {title}
      </h1>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {i18n.language?.startsWith("en") ? "Loading..." : "جاري التحميل..."}
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">
            {i18n.language?.startsWith("en")
              ? `Error: ${error}`
              : `خطأ: ${error}`}
          </p>
        </div>
      )}

      {!loading && !error && infographics.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {i18n.language?.startsWith("en")
              ? "No infographics found"
              : "لا توجد إنفوغرافيك متاحة"}
          </p>
        </div>
      )}

      {!loading && !error && infographics.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {infographics.map((infograph) => (
              <a
                href={infograph.url || infograph.image}
                key={infograph.id}
                className="relative group block overflow-hidden rounded"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={infograph.url || infograph.image}
                  alt={infograph.title}
                  className="w-full h-[380px] object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  {infograph.title}
                </div>
              </a>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <ul className="flex items-center gap-2">
                {/* Previous Button */}
                <li>
                  {pagination.hasPrev ? (
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
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
                    </button>
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
                      {page === pagination.currentPage ? (
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-red-500 text-white">
                          {page}
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page)}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 text-white hover:bg-red-600"
                          aria-label={`Page ${page}`}
                        >
                          {page}
                        </button>
                      )}
                    </li>
                  );
                })}

                {/* Next Button */}
                <li>
                  {pagination.hasNext ? (
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
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
                    </button>
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
          )}
        </>
      )}
    </div>
  );
}
