"use client";
import React from "react";
import SocialIcons from "./SocialIcons";
import ArticleTitle from "./ArticleTitle";
import QuoteBreak from "./QuoteBreak";
import ArticleTags from "./ArticleTags";
import { getCoverImageUrl } from "@/core/imageUtils";

const ArticleMainContent = ({ title, content, articleContent, tags, lang }) => {
  return (
    <div
      className={`w-full lg:w-2/3 min-w-0 lg:border-gray-600 ${
        lang === "ar"
          ? "pl-0 lg:pl-8 lg:border-l"
          : "pr-0 lg:pr-8 lg:border-r"
      }`}
    >
      <ArticleTitle title={title} />

      <div className="mb-8">
        <SocialIcons />
      </div>

      {tags && tags.length > 0 && <ArticleTags tags={tags} lang={lang} />}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="article-content text-black"
        />
        
        {/* Article Content List */}
        {articleContent && articleContent.length > 0 && (
          <div className="article-content-list mt-8">
            {articleContent.map((item) => (
              <div key={item.id} className="mb-6">
                {item.paragraph && (
                  <div
                    className="text-black mb-4"
                    dangerouslySetInnerHTML={{ __html: item.paragraph }}
                  />
                )}
                {item.quote && (
                  <QuoteBreak text={item.quote} />
                )}
                {item.image && getCoverImageUrl(item.image) && (
                  <div className="my-4">
                    <img
                      src={getCoverImageUrl(item.image)}
                      alt=""
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleMainContent;
