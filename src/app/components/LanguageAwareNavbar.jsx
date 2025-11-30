"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearch(query);
    },
    [query, onSearch]
  );

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
                className="flex items-center"
                aria-label={t("search")}
              >
                <div className="flex items-center bg-gray-100 rounded overflow-hidden">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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
                onClick={onLatestIssue}
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
                onClick={onLatestIssue}
                className="bg-gray-200 text-black font-bold px-4 py-2 rounded inline-flex items-center justify-center gap-2 flex-1"
              >
                <FaFilePdf className="text-red-600 text-xl" aria-hidden />
                <span>{t("downloadIssue")}</span>
              </button>

              <form
                onSubmit={handleSearchSubmit}
                className="flex-1 min-w-0"
                aria-label={t("search")}
              >
                <div className="flex items-center gap-2 bg-gray-100 rounded overflow-hidden w-full">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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
