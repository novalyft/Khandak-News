import React from "react";
import ArticleMainContent from "./ArticleMainContent";
import ArticleSidebar from "./ArticleSidebar";

const ArticleLayout = ({ title, content, articleContent, tags, lang }) => {
  return (
    <div className="container mx-auto mt-12 px-4">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <ArticleMainContent title={title} content={content} articleContent={articleContent} tags={tags} lang={lang} />
        <ArticleSidebar />
      </div>
    </div>
  );
};

export default ArticleLayout;
