"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export default function PhilosophySection() {
  const { t, i18n, ready } = useTranslation("common");
  if (!ready) return null; // avoid hydration mismatch if translations aren't ready yet

  // Fallback if the key is missing
  const heading = t("cat.philosophy", {
    defaultValue: i18n.language?.startsWith("en") ? "Philosophy" : "فلسفة",
  });

  const posts = [
    { title: "طوفان جارف للأيديولوجيا الإسرائيلية", date: "26/10/2023", views: 13, image: "https://al-khandak.com/storage/posts/October2023/aTRSExJQw0eOAmf9OvTJ.jpg" },
    { title: `'إعادة ضبط كبيرة'" نعم، ولتَكن حقيقية (2)"`, date: "17/11/2021", views: 12, image: "https://al-khandak.com/storage/posts/December2021/ydg3N5iAD5O6Rxh7nv2d.jpg" },
    { title: "مع جيجك: لماذا لا أزال شيوعيّاً", date: "13/11/2021", views: 1, image: "https://al-khandak.com/storage/posts/old/1587485208_1928897977.jpeg" },
    { title: "موقع الديالكتيك والاغتراب عند ماركس", date: "13/11/2021", views: 8, image: "https://al-khandak.com/storage/posts/old/1610733252_1992518850.jpeg" },
    { title: `'الملك يقفُ عارياً'"؛ أيّ مستقبل لأوروبا؟"`, date: "13/11/2021", views: 2, image: "https://al-khandak.com/storage/posts/old/1591033329_554978220.jpeg" },
    { title: `'إعادة ضبط كبيرة'" نعم، ولتَكن حقيقية (1)"`, date: "13/11/2021", views: 9, image: "https://al-khandak.com/storage/posts/old/1615483501_64475813.jpeg" },
    { title: "لا حياد في قضايا العدالة", date: "13/11/2021", views: 4, image: "https://al-khandak.com/storage/posts/old/1597088882_728975258.jpeg" },
    { title: "الأوجه الأربعة للتصوّف في العصر الحديث", date: "13/11/2021", views: 11, image: "https://al-khandak.com/storage/posts/old/1625417150_11779369.jpeg" },
    { title: "الحقبة الريغانية وسياسة الترحيل الصناعي", date: "13/11/2021", views: 5, image: "https://al-khandak.com/storage/posts/old/1599920708_2141382091.jpeg" },
    { title: "العنف كضرورة رأسمالية", date: "13/11/2021", views: 6, image: "https://al-khandak.com/storage/posts/old/1604065556_1087953091.jpeg" },
    { title: "العنف كضرورة رأسمالية (2)", date: "13/11/2021", views: 7, image: "https://al-khandak.com/storage/posts/old/1607034564_419840362.jpeg" },
  ];

  const totalPages = 7;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const currentPage = 1;

  return (
    // ⚠️ Do NOT hardcode dir here; let <html dir="..."> control RTL/LTR.
    <div className="container mx-auto px-4 pb-[70px]">
      <h1 className="text-black ms-5 mb-4 text-3xl font-bold pb-[14px] pt-[50px] ltr:text-left rtl:text-right">
        {heading}
      </h1>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {posts.map((post, idx) => (
          <a key={idx} href={post.link || "#"} className="block group rounded overflow-hidden shadow-lg">
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                <div className="flex items-center text-gray-300 text-sm gap-4">
                  <p className="flex items-center gap-1">
                    <i className="fas fa-clock text-xs" />
                    {post.date}
                  </p>
                  {/* <p className="flex items-center gap-1">
                    <i className="fas fa-newspaper text-xs" />
                    {post.views}
                  </p> */}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
  <ul className="flex items-center gap-2">
    {/* Prev */}
    <li>
      <button
        className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-700 text-gray-400 cursor-not-allowed"
        disabled
        aria-label="Previous page"
      >
        {/* left chevron */}
        <svg
          className="w-4 h-4 rtl:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </li>

    {pages.map((page) => (
      <li key={page}>
        <a
          className={`inline-flex items-center justify-center w-10 h-10 rounded-md leading-none ${
            page === 1 ? "bg-red-500 text-white" : "bg-gray-800 text-white hover:bg-red-600"
          }`}
        >
          {page}
        </a>
      </li>
    ))}

    {/* Next */}
    <li>
      <a
        className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 text-white hover:bg-blue-600"
        aria-label="Next page"
      >
        {/* right chevron */}
        <svg
          className="w-4 h-4 rtl:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </a>
    </li>
  </ul>
</div>

    </div>
  );
}
