import React from "react";
import { getByCategory, getPaginationInfo } from "@/core/repo";
import CategoryHeader from "../CategoryHeader";
import ArticlesGrid from "../ArticlesGrid";
import Pagination from "../Pagination";

// Revalidate every 2 minutes
export const revalidate = 120;

// Category mapping for translations (using English IDs)
const categoryTranslations = {
  mhlyat: {
    ar: "محليات",
    en: "Local News",
  },
  "culture-media": {
    ar: "ثقافة وميديا",
    en: "Culture & Media",
  },
  philosophy: {
    ar: "فلسفة",
    en: "Philosophy",
  },
  opinion: {
    ar: "رأي",
    en: "Opinion",
  },
  economy: {
    ar: "اقتصاد",
    en: "Economy",
  },
  sports: {
    ar: "رياضة",
    en: "Sports",
  },
  africa: {
    ar: "افريقيا",
    en: "Africa",
  },
  "international-affairs": {
    ar: "عربي ودولي",
    en: "International Affairs",
  },
  "israeli-occupation": {
    ar: "اسرائيليات",
    en: "Israeli Occupation",
  },
  editorial: {
    ar: "افتتاحية",
    en: "Editorial",
  },
};

const ArticleCategoryPage = async ({ params, searchParams }) => {
  const categoryId = params.id;
  const lang = params.lang || "ar";
  const currentPage = parseInt(searchParams.page) || 1;
  const limit = 12; // Articles per page

  let articlesData = null;
  let error = null;

  try {
    // Fetch articles by category with pagination
    articlesData = await getByCategory(categoryId, limit, lang, currentPage);
  } catch (err) {
    console.error("Error fetching articles:", err);
    error = err;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pb-[70px]">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error loading articles
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!articlesData || !articlesData.data || articlesData.data.length === 0) {
    return (
      <div className="container mx-auto px-4 pb-[70px]">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            No articles found
          </h1>
          <p className="text-gray-500">
            No articles available for this category.
          </p>
        </div>
      </div>
    );
  }

  // Get category title
  const categoryTitle = categoryTranslations[categoryId]?.[lang] || categoryId;

  // Calculate pagination from API metadata using utility function
  const paginationMeta = articlesData.meta?.pagination;
  const paginationInfo = getPaginationInfo(paginationMeta, currentPage, limit);

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <CategoryHeader title={categoryTitle} lang={lang} />

      <ArticlesGrid articles={articlesData.data} lang={lang} />

      {paginationInfo.pageCount > 1 && (
        <Pagination
          currentPage={paginationInfo.current}
          totalPages={paginationInfo.pageCount}
          categoryId={categoryId}
          lang={lang}
        />
      )}
    </div>
  );
};

export default ArticleCategoryPage;
