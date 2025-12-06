"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { FaBars, FaSearch, FaFilePdf } from "react-icons/fa";
import Link from "next/link";

// Load Sidebar on the client only to avoid SSR hydration mismatches
const Sidebar = dynamic(() => import("./Sidebar"), { ssr: false });

const langToDir = (lng) => (lng === "ar" ? "rtl" : "ltr");

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string in DD/MM/YYYY format
 */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

/**
 * Language-aware navigation bar component with responsive design
 * Supports desktop and mobile layouts with language switching, search, and edition selection
 * @param {Object} props - Component props
 * @param {Function} props.onLatestIssue - Callback when latest issue button is clicked
 * @param {Function} props.onEditionChange - Callback when edition selection changes
 * @param {Function} props.onSearch - Callback when search form is submitted
 */
export default function LanguageAwareNavbar({
  onLatestIssue = () => {},
  onEditionChange = () => {},
  onSearch = () => {},
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [editions, setEditions] = useState([]);
  const [isLoadingEditions, setIsLoadingEditions] = useState(true);
  const [editionsError, setEditionsError] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Memoize current language extraction from pathname
  const currentLang = useMemo(() => {
    return pathname.split("/")[1] || "ar";
  }, [pathname]);

  /**
   * Apply language settings to document and storage
   * @param {string} val - Language code (ar/en)
   */
  const applyLang = useCallback((val) => {
    document.documentElement.setAttribute("lang", val);
    document.documentElement.setAttribute("dir", langToDir(val));
    try {
      localStorage.setItem("lang", val);
      document.cookie = `lang=${val}; path=/; max-age=${60 * 60 * 24 * 365}`;
    } catch {}
  }, []);

  useEffect(() => {
    applyLang(currentLang);
  }, [currentLang, applyLang]);

  // Fetch editions on component mount using server-side API route
  useEffect(() => {
    const fetchEditions = async () => {
      setIsLoadingEditions(true);
      setEditionsError(null);
      try {
        // Use server-side API route to avoid CORS and mixed content issues
        const response = await fetch("/api/editions?page=1&pageSize=100");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch editions: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        // Handle different possible response structures from Strapi v4
        // Structure 1: { data: [...], meta: {...} } (standard Strapi format)
        // Structure 2: [...] (direct array, if API returns differently)
        let editionsData = [];

        if (Array.isArray(data)) {
          // Response is already an array
          editionsData = data;
        } else if (data?.data && Array.isArray(data.data)) {
          // Response has data property with array
          editionsData = data.data;
        } else if (data?.data?.data && Array.isArray(data.data.data)) {
          // Nested data structure
          editionsData = data.data.data;
        }

        // Validate that we have valid edition objects with required fields
        const validEditions = editionsData.filter(
          (edition) => edition && (edition.id || edition.number)
        );

        if (validEditions.length > 0) {
          setEditions(validEditions);
          setEditionsError(null); // Clear any previous errors
        } else {
          // No valid editions found, but no error - might be empty
          setEditions([]);
          if (process.env.NODE_ENV === "development") {
            console.warn("No valid editions found in response:", data);
          }
        }
      } catch (error) {
        // Enhanced error logging for production debugging
        const errorMessage =
          error?.message || "Unknown error fetching editions";
        const errorDetails = {
          message: errorMessage,
          timestamp: new Date().toISOString(),
        };

        console.error("Error fetching editions:", errorDetails, error);
        setEditionsError(error);
        // Keep existing editions if available, don't clear them on error
        // This allows users to still interact with the dropdown
      } finally {
        setIsLoadingEditions(false);
      }
    };
    fetchEditions();
  }, []);

  const switchLanguage = useCallback(() => {
    const nextLang = currentLang === "ar" ? "en" : "ar";

    // Get the current path without the language prefix
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, "") || "/";

    // Navigate to the same page but with different language
    router.push(`/${nextLang}${pathWithoutLang}`);
  }, [currentLang, pathname, router]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Fetch search suggestions as user types
  const fetchSearchSuggestions = useCallback(
    async (searchQuery) => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(
          `/api/search?titleQuery=${encodeURIComponent(
            searchQuery
          )}&page=1&pageSize=5&locale=${currentLang}`
        );

        if (response.ok) {
          const data = await response.json();
          // Handle different possible response structures
          let articles = [];
          if (Array.isArray(data)) {
            articles = data;
          } else if (data?.data && Array.isArray(data.data)) {
            articles = data.data;
          } else if (data?.data?.data && Array.isArray(data.data.data)) {
            articles = data.data.data;
          }
          setSearchSuggestions(articles);
          setShowSuggestions(articles.length > 0);
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSearchSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    [currentLang]
  );

  // Debounced search suggestions
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchSuggestions(query);
    }, 300); // 300ms debounce

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, fetchSearchSuggestions]);

  // Handle clicks outside search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDesktop =
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target);
      const isOutsideMobile =
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target);

      if (isOutsideDesktop && isOutsideMobile) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (query.trim()) {
        setShowSuggestions(false);
        // Navigate to search results page with query parameter
        router.push(
          `/${currentLang}/search?q=${encodeURIComponent(query.trim())}`
        );
      }
    },
    [query, currentLang, router]
  );

  const handleSuggestionClick = useCallback(
    (article) => {
      setShowSuggestions(false);
      setQuery("");
      router.push(`/${currentLang}/article/${article.documentId}`);
    },
    [currentLang, router]
  );

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setShowSuggestions(true);
    }
  }, []);

  const handleInputFocus = useCallback(() => {
    if (searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [searchSuggestions.length]);

  const handleEditionChange = useCallback(
    (e) => {
      const editionNumber = e.target.value;
      if (editionNumber) {
        // Navigate to edition page with the edition number
        router.push(`/${currentLang}/edition/${editionNumber}`);
      }
      // Call the callback if provided (for backward compatibility)
      onEditionChange(editionNumber);
    },
    [currentLang, router, onEditionChange]
  );

  const handleDownloadPdf = useCallback(() => {
    // Check if we're on an edition page
    const editionMatch = pathname.match(/\/edition\/(\d+)/);
    const editionNumber = editionMatch ? editionMatch[1] : null;

    // Construct API URL with optional editionNumber parameter
    const apiUrl = editionNumber
      ? `/api/download-pdf?editionNumber=${editionNumber}`
      : `/api/download-pdf`;

    // Open the API route which will redirect to the PDF
    window.open(apiUrl, "_blank");
  }, [pathname]);

  return (
    <>
      <header className="w-full border-b border-gray-300 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* =================== DESKTOP (≥ lg) =================== */}
          <div className="hidden lg:flex w-full items-center">
            <div className="flex items-center gap-6 flex-1">
              <button
                aria-label={t("openMenu")}
                className="text-black text-xl"
                onClick={toggleSidebar}
              >
                <FaBars />
              </button>

              <button
                onClick={switchLanguage}
                className="bg-gray-200 text-black font-bold px-4 py-2 rounded"
                aria-label={t("toggleAria")}
              >
                {currentLang === "ar" ? "En" : "ع"}
              </button>

              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center relative"
                aria-label={t("search")}
              >
                <div
                  ref={desktopSearchRef}
                  className="relative flex items-center bg-gray-100 rounded overflow-visible"
                >
                  <input
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    type="text"
                    required
                    placeholder={t("searchPlaceholder")}
                    onInvalid={(e) =>
                      e.currentTarget.setCustomValidity(t("searchRequired"))
                    }
                    onInput={(e) => e.currentTarget.setCustomValidity("")}
                    className="px-4 py-2 bg-transparent text-black placeholder-gray-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 flex items-center justify-center"
                    aria-label={t("search")}
                  >
                    <FaSearch className="text-black" />
                  </button>
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                      {isLoadingSuggestions ? (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          {t("loading") || "Loading..."}
                        </div>
                      ) : searchSuggestions.length > 0 ? (
                        <>
                          {searchSuggestions.map((article) => (
                            <button
                              key={article.id || article.documentId}
                              type="button"
                              onClick={() => handleSuggestionClick(article)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors"
                            >
                              <div className="font-semibold text-black text-sm mb-1 line-clamp-2">
                                {article.title}
                              </div>
                              {article.createdAt && (
                                <div className="text-xs text-gray-500">
                                  {new Date(
                                    article.createdAt
                                  ).toLocaleDateString("ar-SA")}
                                </div>
                              )}
                            </button>
                          ))}
                          <Link
                            href={`/${currentLang}/search?q=${encodeURIComponent(
                              query.trim()
                            )}`}
                            onClick={() => setShowSuggestions(false)}
                            className="block px-4 py-3 text-center text-sm font-semibold text-blue-600 hover:bg-gray-100 border-t border-gray-200"
                          >
                            {t("viewAllResults") || "View all results"} →
                          </Link>
                        </>
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          {t("noResults") || "No results found"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="flex justify-center flex-1">
              <Link href={`/${currentLang}`}>
                <img
                  src="/images/logo.svg"
                  alt={t("brandAlt")}
                  className="h-16 object-contain"
                />
              </Link>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-end">
              <button
                onClick={handleDownloadPdf}
                className="bg-gray-200 text-black font-bold px-4 py-2 rounded inline-flex items-center gap-2"
              >
                <FaFilePdf className="text-red-600 text-xl" aria-hidden />
                <span>{t("downloadIssue")}</span>
              </button>

              <select
                onChange={handleEditionChange}
                className="px-3 py-2 rounded border border-black bg-white text-sm text-black"
                aria-label={t("issueDate")}
                defaultValue=""
                disabled={isLoadingEditions}
              >
                <option disabled value="">
                  {isLoadingEditions
                    ? t("loading") || "Loading..."
                    : editionsError && editions.length === 0
                      ? t("error") || "Error loading editions"
                      : t("issueDate")}
                </option>
                {editions.length > 0
                  ? editions.map((edition) => (
                      <option key={edition.id} value={edition.number}>
                        {t("issue")} {edition.number} -{" "}
                        {formatDate(edition.date)}
                      </option>
                    ))
                  : !isLoadingEditions && (
                      <option disabled value="">
                        {editionsError
                          ? t("error") || "Error loading editions"
                          : t("noEditions") || "No editions available"}
                      </option>
                    )}
              </select>
            </div>
          </div>

          {/* =================== MOBILE (< lg) =================== */}
          <div className="flex flex-col lg:hidden">
            <div className="relative flex items-center justify-between min-h-[88px]">
              <button
                onClick={switchLanguage}
                className="bg-gray-200 text-black font-bold px-4 py-2 rounded"
                aria-label={t("toggleAria")}
              >
                {currentLang === "ar" ? "En" : "ع"}
              </button>

              <button
                aria-label={t("openMenu")}
                className="text-black text-xl"
                onClick={toggleSidebar}
              >
                <FaBars />
              </button>

              <div className="absolute inset-x-0 top-3 bottom-3 pointer-events-none flex items-center justify-center">
                <Link href={`/${currentLang}`} className="pointer-events-auto">
                  <img
                    src="/images/logo.svg"
                    alt={t("brandAlt")}
                    className="h-16 object-contain"
                  />
                </Link>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 px-1">
              <button
                onClick={handleDownloadPdf}
                className="bg-gray-200 text-black font-bold px-4 py-2 rounded inline-flex items-center justify-center gap-2 flex-1"
              >
                <FaFilePdf className="text-red-600 text-xl" aria-hidden />
                <span>{t("downloadIssue")}</span>
              </button>

              <form
                onSubmit={handleSearchSubmit}
                className="flex-1 min-w-0 relative"
                aria-label={t("search")}
              >
                <div
                  ref={mobileSearchRef}
                  className="relative flex items-center gap-2 bg-gray-100 rounded overflow-visible w-full"
                >
                  <input
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    name="q"
                    type="text"
                    required
                    placeholder={t("searchPlaceholder")}
                    onInvalid={(e) =>
                      e.currentTarget.setCustomValidity(t("searchRequired"))
                    }
                    onInput={(e) => e.currentTarget.setCustomValidity("")}
                    className="flex-1 min-w-0 px-4 py-2 bg-transparent text-black placeholder-gray-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 flex items-center justify-center"
                    aria-label={t("search")}
                  >
                    <FaSearch className="text-black" />
                  </button>
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                      {isLoadingSuggestions ? (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          {t("loading") || "Loading..."}
                        </div>
                      ) : searchSuggestions.length > 0 ? (
                        <>
                          {searchSuggestions.map((article) => (
                            <button
                              key={article.id || article.documentId}
                              type="button"
                              onClick={() => handleSuggestionClick(article)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors"
                            >
                              <div className="font-semibold text-black text-sm mb-1 line-clamp-2">
                                {article.title}
                              </div>
                              {article.createdAt && (
                                <div className="text-xs text-gray-500">
                                  {new Date(
                                    article.createdAt
                                  ).toLocaleDateString("ar-SA")}
                                </div>
                              )}
                            </button>
                          ))}
                          <Link
                            href={`/${currentLang}/search?q=${encodeURIComponent(
                              query.trim()
                            )}`}
                            onClick={() => setShowSuggestions(false)}
                            className="block px-4 py-3 text-center text-sm font-semibold text-blue-600 hover:bg-gray-100 border-t border-gray-200"
                          >
                            {t("viewAllResults") || "View all results"} →
                          </Link>
                        </>
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          {t("noResults") || "No results found"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="mt-3 px-1">
              <select
                onChange={handleEditionChange}
                className="w-full px-3 py-2 rounded border border-black bg-white text-sm text-black"
                aria-label={t("issueDate")}
                defaultValue=""
                disabled={isLoadingEditions}
              >
                <option disabled value="">
                  {isLoadingEditions
                    ? t("loading") || "Loading..."
                    : editionsError && editions.length === 0
                      ? t("error") || "Error loading editions"
                      : t("issueDate")}
                </option>
                {editions.length > 0
                  ? editions.map((edition) => (
                      <option key={edition.id} value={edition.number}>
                        {t("issue")} {edition.number} -{" "}
                        {formatDate(edition.date)}
                      </option>
                    ))
                  : !isLoadingEditions && (
                      <option disabled value="">
                        {editionsError
                          ? t("error") || "Error loading editions"
                          : t("noEditions") || "No editions available"}
                      </option>
                    )}
              </select>
            </div>
          </div>
        </div>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        lang={currentLang}
      />
    </>
  );
}
