import React from "react";
import Link from "next/link";
import { getArticle, getRelatedArticles } from "@/core/repo";
import { getCoverImageUrl, getAvatarImageUrl, getFallbackImageUrl } from "@/core/imageUtils";
import ArticleHeader from "../ArticleHeader";
import ArticleLayout from "../ArticleLayout";

const isArabicText = (text = "") => /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(text);

// Revalidate every 2 minutes
export const revalidate = 120;

const ArticlePage = async ({ params }) => {
  const { id, lang = "ar" } = await params;
  let articleData = null;
  let error = null;

  try {
    if (id) {
      articleData = await getArticle(id);
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

  // The article is stored in a single language. If its language does not match
  // the active site language, show a notice instead of rendering wrong-language
  // content (e.g. switching to English on an Arabic-only article).
  const articleLang = isArabicText(articleData.data.title) ? "ar" : "en";
  if (articleLang !== lang) {
    const copy = {
      en: {
        title: "This article is available in Arabic only",
        body: "The article you are looking for has not been published in English.",
        read: "Read in Arabic",
        home: "Back to homepage",
      },
      ar: {
        title: "هذا المقال متوفر باللغة الإنجليزية فقط",
        body: "المقال الذي تبحث عنه غير منشور باللغة العربية.",
        read: "اقرأ بالإنجليزية",
        home: "العودة إلى الصفحة الرئيسية",
      },
    };
    const m = copy[lang] || copy.ar;
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{m.title}</h1>
          <p className="text-gray-600 mb-8">{m.body}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${articleLang}/article/${id}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
            >
              {m.read}
            </Link>
            <Link
              href={`/${lang}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
            >
              {m.home}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch related articles (tag matches prioritized, then same category)
  let relatedPosts = [];
  try {
    const related = await getRelatedArticles(articleData.data, lang, 4);
    relatedPosts = related.map((a) => ({
      id: a.documentId,
      title: a.title,
      url: `/${lang}/article/${a.documentId}`,
      image: getCoverImageUrl(a.cover) || getFallbackImageUrl(),
      date: new Date(a.edition?.date || a.createdAt).toLocaleDateString(
        lang === "ar" ? "ar-SA" : "en-GB"
      ),
    }));
  } catch (err) {
    console.error("Error fetching related articles:", err);
  }

  return (
    <div className="col-12 post-content pb-5 bg-white border-l-0 lg:border-l-2 lg:border-gray-300">
      <ArticleHeader
        coverImage={getCoverImageUrl(articleData.data.cover)}
        description={articleData.data.description}
        authorName={articleData.data.author?.name}
        authorImage={getAvatarImageUrl(articleData.data.author?.avatar)}
        authorLink={articleData.data.author?.link}
        lang={lang}
      />

      <ArticleLayout
        title={articleData.data.title}
        content={articleData.data.content}
        articleContent={articleData.data.articleContent}
        tags={articleData.data.tags}
        lang={lang}
        relatedArticles={relatedPosts}
      />
    </div>
  );
};

export default ArticlePage;
