"use client";
import ArticleCard from "./ArticleCard";

const ArticlesGrid = ({ articles, lang = "ar" }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {articles.map((article, idx) => (
        <ArticleCard
          key={article.id || idx}
          article={article}
          index={idx}
          lang={lang}
        />
      ))}
    </div>
  );
};

export default ArticlesGrid;
