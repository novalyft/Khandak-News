"use client";
import React from "react";
import Link from "next/link";

const ArticleTags = ({ tags, lang = "ar" }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-wrap gap-2 items-center">
        <span
          className={`text-sm font-semibold text-gray-700 ${lang === "ar" ? "ml-2" : "mr-2"}`}
        >
          {lang === "ar" ? "الوسوم:" : "Tags:"}
        </span>
        {tags.map((tag) => {
          // Extract tag name and use it for both display and link
          // searchByTag searches by tagName, so we use tagName as the route parameter
          const tagName =
            typeof tag === "string" ? tag : tag.tagName || tag.name || tag.id;
          const tagId =
            typeof tag === "string" ? tag : tag.id || tag.tagName || tag.name;

          return (
            <Link
              key={tagId}
              href={`/${lang}/article-tags/${encodeURIComponent(tagName)}`}
              className="inline-block px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors duration-200"
            >
              {tagName}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ArticleTags;
