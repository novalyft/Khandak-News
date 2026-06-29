import React from "react";
import PostsList from "./AuthorCard";

const ArticleSidebar = ({ relatedArticles = [], lang = "ar" }) => {
  return (
    <aside className="w-full lg:w-1/3 pl-0 lg:pl-6">
      <PostsList posts={relatedArticles} lang={lang} />
    </aside>
  );
};

export default ArticleSidebar;
