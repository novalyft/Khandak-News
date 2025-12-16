import React from "react";
import { searchByTag, getPaginationInfo } from "@/core/repo";
import CategoryHeader from "../CategoryHeader";
import ArticlesGrid from "../ArticlesGrid";
import Pagination from "../Pagination";

// Revalidate every 2 minutes
export const revalidate = 120;

const ArticleTagsPage = async ({ params, searchParams }) => {
  const tagId = params.id;
  const lang = params.lang || "ar";
  const currentPage = parseInt(searchParams.page) || 1;
  const limit = 12; // Articles per page

  let articlesData = null;
  let error = null;

  try {
    // Fetch articles by tag with pagination
    // The tagId could be a tag ID or tagName, searchByTag uses tagName for searching
    articlesData = await searchByTag(tagId, limit, lang, currentPage);
  } catch (err) {
    console.error("Error fetching articles by tag:", err);
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
            {lang === "ar" ? "لم يتم العثور على مقالات" : "No articles found"}
          </h1>
          <p className="text-gray-500">
            {lang === "ar" 
              ? "لا توجد مقالات متاحة لهذا الوسم." 
              : "No articles available for this tag."}
          </p>
        </div>
      </div>
    );
  }

  // Get tag title - use the tagId as the title, or extract from first article's tags if available
  let tagTitle = tagId;
  if (articlesData.data && articlesData.data.length > 0) {
    const firstArticle = articlesData.data[0];
    if (firstArticle.tags && firstArticle.tags.length > 0) {
      const matchingTag = firstArticle.tags.find(
        (tag) => tag.id?.toString() === tagId || tag.tagName === tagId || tag.name === tagId
      );
      if (matchingTag) {
        tagTitle = matchingTag.tagName || matchingTag.name || tagId;
      }
    }
  }

  // Calculate pagination from API metadata using utility function
  const paginationMeta = articlesData.meta?.pagination;
  const paginationInfo = getPaginationInfo(paginationMeta, currentPage, limit);

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <CategoryHeader title={tagTitle} lang={lang} />

      <ArticlesGrid articles={articlesData.data} lang={lang} />

      {paginationInfo.pageCount > 1 && (
        <Pagination
          currentPage={paginationInfo.current}
          totalPages={paginationInfo.pageCount}
          categoryId={tagId}
          lang={lang}
          basePath={`/${lang}/article-tags/${tagId}`}
        />
      )}
    </div>
  );
};

export default ArticleTagsPage;
