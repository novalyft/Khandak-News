import React from "react";
import { getArticle } from "@/core/repo";
import { getCoverImageUrl, getAvatarImageUrl } from "@/core/imageUtils";
import ArticleHeader from "../ArticleHeader";
import ArticleLayout from "../ArticleLayout";

const ArticlePage = async ({ params }) => {
  let articleData = null;
  let error = null;

  try {
    if (params?.id) {
      articleData = await getArticle(params.id);
    }
  } catch (err) {
    console.error("Error fetching article:", err);
    error = err;
  }

  if (error) {
    return <div>Error loading article</div>;
  }

  if (!articleData) {
    return <div>Article not found</div>;
  }

  return (
    <div className="col-12 post-content pb-5 bg-white border-l-0 lg:border-l-2 lg:border-gray-300">
      <ArticleHeader
        coverImage={getCoverImageUrl(articleData.data.cover)}
        description={articleData.data.description}
        authorName={articleData.data.author?.name}
        authorImage={getAvatarImageUrl(articleData.data.author?.avatar)}
        authorLink={articleData.data.author?.link}
        dir="rtl"
      />

      <ArticleLayout
        title={articleData.data.title}
        content={articleData.data.content}
        articleContent={articleData.data.articleContent}
      />
    </div>
  );
};

export default ArticlePage;
