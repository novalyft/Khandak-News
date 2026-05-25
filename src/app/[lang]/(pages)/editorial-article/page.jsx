"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const editorialItems = [
  {
    title: "انهيار نظام أو ونهاية حقبة؟",
    date: "11/01/2025",
    views: "13",
    image: "https://al-khandak.com/storage/posts/January2025/QLhuqlsuGOGWsz6FMoNX.jpeg",
    url: "/editorial-article/1",
  },
  {
    title: "في مديح السابع من تشرين",
    date: "08/10/2024",
    views: "13",
    image: "https://al-khandak.com/storage/posts/October2024/bR1tdQy2kvyeL24Vn2rE.png",
    url: "/editorial-article/2",
  },
  {
    title: "لابيد – غانتس: الصرخة الأخيرة",
    date: "10/11/2022",
    views: "12",
    image: "https://al-khandak.com/storage/posts/November2022/MR2jj7116cJPG5W1us6Y.jpg",
    url: "/editorial-article/3",
  },
  {
    title: "انتخابات 1972 –2022: نصف قرن من التيه",
    date: "19/05/2022",
    views: "12",
    image: "https://al-khandak.com/storage/posts/May2022/wfJcw0sdLa7EqfHPv4yv.jpg",
    url: "/editorial-article/4",
  },
  {
    title: "أفغانستان: نهاية اللعبة الكبرى مجدداً",
    date: "17/11/2021",
    views: "12",
    image: "https://al-khandak.com/storage/posts/old/1630634844_1126671023.png",
    url: "/editorial-article/5",
  },
];

const totalPages = 7; // set the real number if you have it
const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
const pagination = {
  currentPage: 1,
  totalPages,
  // baseUrl: "/editorial?page=",
};

export default function EditorialArticleGrid() {
  const { t, ready, i18n } = useTranslation("common");
  if (!ready) return null;

  const title = t("cat.editorial", {
    defaultValue: i18n.language?.startsWith("en") ? "Editorial" : "افتتاحية",
  });

  return (
    <div className="container mx-auto px-4 bg-white pb-[70px]">
      <h1 className="text-black ms-5 mb-4 text-3xl font-bold pt-[50px] pb-[14px] ltr:text-left rtl:text-right">
        {title}
      </h1>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {editorialItems.map((item, idx) => (
          <div key={item.url || idx} className="col-span-1">
            <Link href={item.url || "#"} className="block group">
              <div className="relative overflow-hidden rounded shadow-sm bg-white">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <div className="text-white font-semibold text-lg leading-tight">
                    {item.title}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-white">
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6l2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z"
                        />
                      </svg>
                      {/* <span>{item.views}</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="w-full text-center mt-5">{/* optional more button */}</div>

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
