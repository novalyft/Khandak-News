"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export default function FilesSection() {
  const { t, ready, i18n } = useTranslation("common");
  if (!ready) return null;

  // Only the title translates
  const title = t("cat.folders", {
    defaultValue: i18n.language?.startsWith("en") ? "Folders" : "ملفات",
  });

  // const files = [
  //   {
  //     title: "عنوان",
  //     link: "https://al-khandak.com/folders/title",
  //     image: "https://al-khandak.com/storage",
  //   },
  // ];
  const files = [];

  const itemsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(files.length / itemsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <h1 className="text-black ms-5 mb-4 text-3xl font-bold pb-[14px] pt-[50px] ltr:text-left rtl:text-right">
        {title}
      </h1>

      {files.length === 0 ? (
        <p className="text-center text-gray-500 py-16">{t("noFolders")}</p>
      ) : (
        <>
          <div className="grid gap-2 grid-cols-1 lg:grid-cols-3">
            {files.map((file, idx) => (
              <a
                key={idx}
                // href={file.link}
                className="block rounded overflow-hidden shadow-lg relative group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={file.image}
                  alt={file.title}
                  className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-lg font-semibold">
                  {file.title}
                </div>
              </a>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <ul className="flex items-center gap-2">
              <li>
                <button
                  className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-700 text-gray-400 cursor-not-allowed"
                  disabled
                  aria-label="Previous page"
                >
                  <svg className="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              </li>
              {pages.map((page) => (
                <li key={page}>
                  <a className={`inline-flex items-center justify-center w-10 h-10 rounded-md leading-none ${page === 1 ? "bg-red-500 text-white" : "bg-gray-800 text-white hover:bg-red-600"}`}>
                    {page}
                  </a>
                </li>
              ))}
              <li>
                <a className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 text-white hover:bg-blue-600" aria-label="Next page">
                  <svg className="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
