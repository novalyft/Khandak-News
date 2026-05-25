"use client";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Africa() {
  const { t, ready, i18n } = useTranslation("common");

  const posts = [
    {
      img: "https://al-khandak.com/storage/posts/November2022/fche4zVOOT00AVoIDLTP.jpg",
      title: "سانكارا: النبي المسلّح (الجزء الأول)",
      date: "02/11/2022",
      count: 12,
    },
    {
      img: "https://al-khandak.com/storage/posts/old/1587304917_894055654.jpeg",
      title: "السباق الليبي: رهانات النفوذ والصراع على الطاقة",
      date: "13/11/2021",
      count: 1,
    },
    {
      img: "https://al-khandak.com/storage/posts/old/1587308114_260391555.jpeg",
      title: "الأدب الأفريقي الحديث بين نموذجين: شوقي وسيزير",
      date: "13/11/2021",
      count: 1,
    },
    // add more posts here…
  ];

  const perPage = 6;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const pageList = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const pagedPosts = useMemo(() => {
    const start = (page - 1) * perPage;
    return posts.slice(start, start + perPage);
  }, [page, perPage, posts]);

  const title = t("cat.africa", {
    defaultValue: i18n.language?.startsWith("en") ? "Africa" : "افريقيا",
  });

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  if (!ready) return null;

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <h1 className="text-black mb-6 ms-5 text-3xl font-bold pt-[50px] pb-[14px] ltr:text-left rtl:text-right">
        {title}
      </h1>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {pagedPosts.map((post, index) => (
          <div key={index} className="relative">
            <a href={post.link ?? "#"} target="_blank" rel="noopener noreferrer">
              <img
                src={post.img}
                alt={post.title}
                className="w-full h-[300px] object-cover rounded-md"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white rounded">
                <p className="font-semibold">{post.title}</p>
                <div className="flex justify-between text-sm text-gray-300 mt-1">
                  <p><i className="fas fa-clock mr-1" />{post.date}</p>
                  <p><i className="fas fa-newspaper mr-1" />{post.count}</p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <ul className="flex items-center gap-2">
          {/* Prev */}
          <li>
            <button
              onClick={goPrev}
              disabled={page === 1}
              aria-label="Previous page"
              className={`inline-flex items-center justify-center w-10 h-10 rounded-md ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-red-600"
              }`}
            >
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

          {/* Page numbers */}
          {pageList.map((p) => (
            <li key={p}>
              <button
                onClick={() => setPage(p)}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-md leading-none ${
                  p === page
                    ? "bg-red-500 text-white"
                    : "bg-gray-800 text-white hover:bg-red-600"
                }`}
              >
                {p}
              </button>
            </li>
          ))}

          {/* Next */}
          <li>
            <button
              onClick={goNext}
              disabled={page === totalPages}
              aria-label="Next page"
              className={`inline-flex items-center justify-center w-10 h-10 rounded-md ${
                page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-blue-600"
              }`}
            >
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
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
