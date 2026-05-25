"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export default function OpinionSection() {
  const { t, ready, i18n } = useTranslation("common");
  if (!ready) return null;

  // Only the title translates
  const title = t("cat.opinion", {
    defaultValue: i18n.language?.startsWith("en") ? "Opinion" : "رأي",
  });

  const posts = [
    {
      title: "من وحدة الساحات إلى ميثاق الثغور",
      date: "01/04/2025",
      views: 13,
      image:
        "https://al-khandak.com/storage/posts/April2025/ZJnMSz2v83yVIA9lGDRB.jpg",
      // link: "https://al-khandak.com/posts/mn-whdh-alsahat-ila-mythaq-althghwr",
    },
    {
      title:
        "تقاطعات الاستعمار المعرفي: الاغتصاب واستحقاق المستوطن",
      date: "29/03/2025",
      views: 13,
      image:
        "https://al-khandak.com/storage/posts/March2025/Oi8mhhMp1FSWiw5Gp1AR.jpg",
      // link: "https://al-khandak.com/posts/tqataat-alastamar-almarfy-alaghtsab-wasthqaq-almstwtn",
    },
    {
      title:
        "الحرب الإقليمية على نفوذ إيران في الشرق الأوسط",
      date: "18/03/2025",
      views: 13,
      image:
        "https://al-khandak.com/storage/posts/March2025/kxCtNXJrpKZZyvBJ8Oyt.jpg",
      // link: "https://al-khandak.com/posts/alhrb-aliqlymyh-ala-nfwth-iyran-fy-alshrq-alawst",
    },
    // add the rest of your posts here...
  ];

  const pages = [1, 2, 3, 4, 5, 6, 7];

  const pagination = {
    currentPage: 1,
    totalPages: pages.length,
    // baseUrl: "/opinion?page=",
  };

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <h1 className="text-black ms-5 mb-4 text-3xl font-bold pb-[14px] pt-[50px] ltr:text-left rtl:text-right">
        {title}
      </h1>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {posts.map((post, idx) => (
          <a key={idx} href={post.link} className="block group">
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-[300px] object-cover rounded group-hover:opacity-90 transition"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white rounded">
                <h2 className="text-lg font-bold mb-2">{post.title}</h2>
                <div className="flex items-center text-gray-300 text-sm space-x-4 rtl:space-x-reverse">
                  <p className="flex items-center gap-1">
                    <i className="fas fa-clock text-xs"></i>
                    {post.date}
                  </p>
                  {/* <p className="flex items-center gap-1">
                    <i className="fas fa-newspaper text-xs"></i>
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
