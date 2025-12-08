"use client";
import React from "react";
import SocialIcons from "./SocialIcons";
import ArticleTitle from "./ArticleTitle";
import QuoteBreak from "./QuoteBreak";
import { getCoverImageUrl } from "@/core/imageUtils";

const ArticleMainContent = ({ title, content, articleContent }) => {
  return (
    <div className="w-full lg:w-2/3 min-w-0 pl-0 lg:pl-8 lg:border-l lg:border-gray-600">
      <ArticleTitle title={title} />

      <div className="mb-8">
        <SocialIcons />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none" dir="rtl">
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
