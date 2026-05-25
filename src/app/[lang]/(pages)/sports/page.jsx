"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export default function SportsSection() {
  const { t, ready, i18n } = useTranslation("common");
  if (!ready) return null;

  // Only the title translates
  const pageTitle = t("cat.sports", {
    defaultValue: i18n.language?.startsWith("en") ? "Sports" : "رياضة",
  });

  const posts = [
    {
      title: `الملّاك العرب لأندية أوروبا: مستثمرون أم 'زنوج منزل'"؟"`,
      date: "13/11/2021",
      views: 1,
      image: "https://al-khandak.com/storage/posts/old/1587485605_798313262.jpeg",
      // link: "https://al-khandak.com/posts/الملّاك-العرب-لأندية-أوروبا-مستثمرون-أم-زنوج-منزل؟",
    },
    {
      title: `'مدرّج الناس'": الثورات تبدأ من الملاعب"`,
      date: "13/11/2021",
      views: 1,
      image: "https://al-khandak.com/storage/posts/old/1587485704_470616091.jpeg",
      // link: "https://al-khandak.com/posts/مدرّج-الناس-الثورات-تبدأ-من-الملاعب",
    },
    {
      title: `الرياضة اللبنانيّة 'لسه فاكر كان زمان'""`,
      date: "13/11/2021",
      views: 2,
      image: "https://al-khandak.com/storage/posts/old/1591029658_1498851613.jpeg",
      // link: "https://al-khandak.com/posts/الرياضة-اللبنانيّة-لسه-فاكر-كان-زمان",
    },
    {
      title: "محمد بن سلمان يبحث عن اسثمار رياضي: طريق أوروبا مسدود مسدود",
      date: "13/11/2021",
      views: 9,
      image: "https://al-khandak.com/storage/posts/old/1615471950_942817192.jpeg",
      // link: "https://al-khandak.com/posts/محمد-بن-سلمان-يبحث-عن-اسثمار-رياضي-طريق-أوروبا-مسدود-مسدود",
    },
    {
      title: `'بمن حضر'".. غياب الدولار يُبعد المحترفين في الرياضة اللبنانية"`,
      date: "13/11/2021",
      views: 3,
      image: "https://al-khandak.com/storage/posts/old/1594168567_1106879738.jpeg",
      // link: "https://al-khandak.com/posts/بمن-حضر-غياب-الدولار-يُبعد-المحترفين-في-الرياضة-اللبنانية",
    },
    {
      title: "كرة السلة ليست بمأمن",
      date: "13/11/2021",
      views: 3,
      image: "https://al-khandak.com/storage/posts/old/1594168757_1639191444.jpeg",
      // link: "https://al-khandak.com/posts/كرة-السلة-ليست-بمأمن",
    },
    {
      title: "الرياضة في لبنان",
      date: "13/11/2021",
      views: 4,
      image: "https://al-khandak.com/storage/posts/old/1598525486_989531182.jpeg",
      // link: "https://al-khandak.com/posts/الرياضة-في-لبنان",
    },
    {
      title: `حرب مفتوحة بين الأندية والإتحادات... 'سوبر ليغ'" تفضح الجميع"`,
      date: "13/11/2021",
      views: 10,
      image: "https://al-khandak.com/storage/posts/old/1620428512_1580462849.jpeg",
      // link: "https://al-khandak.com/posts/حرب-مفتوحة-بين-الأندية-والإتحادات-سوبر-ليغ-تفضح-الجميع",
    },
    {
      title: "مارادونا: سعادة الفقراء",
      date: "13/11/2021",
      views: 7,
      image: "https://al-khandak.com/storage/posts/old/1607029218_151864294.jpeg",
      // link: "https://al-khandak.com/posts/مارادونا-سعادة-الفقراء",
    },
    {
      title: "مارادونا: الفرد ليس بدعة في التاريخ",
      date: "13/11/2021",
      views: 7,
      image: "https://al-khandak.com/storage/posts/old/1607074443_387903716.jpeg",
      // link: "https://al-khandak.com/posts/مارادونا-الفرد-ليس-بدعة-في-التاريخ",
    },
  ];

  const totalPages = 3;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pagination = { currentPage: 1, totalPages };

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <h1 className="text-black ms-5 mb-4 text-3xl font-bold pb-[14px] pt-[50px] ltr:text-left rtl:text-right">
        {pageTitle}
      </h1>

      <div className="grid gap-2 grid-cols-1 lg:grid-cols-3">
        {posts.map((post, idx) => (
          <a
            key={idx}
            // href={post.link}
            className="block col-span-1 rounded overflow-hidden shadow-lg relative group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
              <div className="flex justify-between text-gray-300 text-sm">
                <p className="flex items-center gap-1">
                  <i className="fas fa-clock text-xs"></i> {post.date}
                </p>
                {/* <p className="flex items-center gap-1">
                  <i className="fas fa-newspaper text-xs"></i> {post.views}
                </p> */}
              </div>
            </div>
          </a>
        ))}
      </div>

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
