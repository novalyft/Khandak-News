import React from "react";
import { getEditionByNumber } from "@/core/repo";
import CategoryHeader from "../CategoryHeader";
import ArticlesGrid from "../ArticlesGrid";

// Revalidate every 2 minutes
export const revalidate = 120;

const EditionPage = async ({ params, searchParams }) => {
  const editionNumber = params.id;
  const lang = params.lang || "ar";

  let editionData = null;
  let error = null;

  try {
    // Fetch edition by number
    editionData = await getEditionByNumber(editionNumber);
  } catch (err) {
    console.error("Error fetching edition:", err);
    error = err;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pb-[70px]">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error loading edition
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!editionData || !editionData.data || editionData.data.length === 0) {
    return (
      <div className="container mx-auto px-4 pb-[70px]">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Edition not found
          </h1>
          <p className="text-gray-500">
            Edition number {editionNumber} was not found.
          </p>
        </div>
      </div>
    );
  }

  // Get the first edition from the response
  const edition = editionData.data[0];

  // Extract articles from the edition
  // The articles might be in edition.articles or similar structure
  const articles = edition?.articles || edition?.data?.articles || [];
  // Get edition title
  const editionTitle = edition?.title
    ? `${edition.title} - ${lang === "ar" ? "العدد" : "Edition"} ${edition.number || editionNumber}`
    : `${lang === "ar" ? "العدد" : "Edition"} ${edition.number || editionNumber}`;

  if (!articles || articles.length === 0) {
    return (
      <div className="container mx-auto px-4 pb-[70px]">
        <CategoryHeader title={editionTitle} lang={lang} />
        <div className="text-center py-8">
          <p className="text-gray-500">
            {lang === "ar"
              ? "لا توجد مقالات في هذا العدد"
              : "No articles in this edition."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <CategoryHeader title={editionTitle} lang={lang} />

      <ArticlesGrid articles={articles} lang={lang} />
    </div>
  );
};

export default EditionPage;
