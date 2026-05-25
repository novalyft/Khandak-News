"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

// Fallback demo data (removed if you pass your own `items` prop)
const FALLBACK_VIDEOS = [
  { id: "DP11ZlNPGRg", title_ar: "الأزمة الاقتصادية العالمية وأزمة 2008 هل يعيد التاريخ نفسه ؟", date: "20/07/2021" },
  { id: "_iiXBbZ5FfM", title_ar: "سليماني بعيونهم الجزء 1", date: "20/07/2021" },
  { id: "b-RMgVZiXkc", title_ar: "سليماني بعيونهم - الجزء 2", date: "20/07/2021" },
  { id: "9Wx-9-ucnnw", title_ar: "من المسؤول عما وصلت إليه الليرة اليوم؟", date: "20/07/2021" },
];

/**
 * Optional bilingual item shape:
 * { id, title_ar, title_en, date }
 */
export default function VideoSection({ items = [] }) {
  const { t, i18n, ready } = useTranslation("common");
  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState("rtl");

  // language + helpers
  const lang = (i18n.language || "ar").startsWith("en") ? "en" : "ar";
  const pick = (obj, base) =>
    lang === "en"
      ? obj?.[`${base}_en`] ?? obj?.[base] ?? obj?.[`${base}_ar`] ?? ""
      : obj?.[`${base}_ar`] ?? obj?.[base] ?? obj?.[`${base}_en`] ?? "";

  // avoid hydration issues; also keep dir synced with <html dir>
  useEffect(() => {
    setMounted(true);
    const getDir = () => document?.documentElement?.getAttribute("dir") || "rtl";
    setDir(getDir());
    const mo = new MutationObserver(() => setDir(getDir()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    return () => mo.disconnect();
  }, []);

  const list = useMemo(() => (items.length ? items : FALLBACK_VIDEOS), [items]);
  const [activeVideo, setActiveVideo] = useState(list[0]?.id || "");
  useEffect(() => {
    // reset active if data changes
    if (list.length && !list.find(v => v.id === activeVideo)) {
      setActiveVideo(list[0].id);
    }
  }, [list, activeVideo]);

  if (!mounted || !ready || !list.length) return null;

  const headingAlign = dir === "rtl" ? "text-right" : "text-left";
  const sectionTitle = t("cat.videos", { defaultValue: lang === "en" ? "Videos" : "فيديو" });
  const viewMoreLabel = t("videoSection.viewMore", {
    defaultValue: lang === "en" ? "View more" : "مشاهدة المزيد",
  });

  return (
    <section className="w-full bg-black py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className={`text-white text-2xl font-bold mb-6 ${headingAlign}`}>{sectionTitle}</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Video */}
          <div className="w-full lg:w-1/2">
            {activeVideo && (
              <iframe
                id="video_frame"
                width="100%"
                height="380"
                src={`https://www.youtube.com/embed/${activeVideo}`}
                title="YouTube video player"
                className="rounded"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          {/* Side Thumbnails */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {list.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveVideo(video.id)}
                className={`flex gap-4 p-3 cursor-pointer rounded-md transition duration-200 ${
                  activeVideo === video.id ? "bg-[#333]" : "hover:bg-[#2c2c2c]"
                }`}
                aria-current={activeVideo === video.id ? "true" : "false"}
              >
                <div
                  className="w-24 h-20 bg-center bg-cover flex items-center justify-center rounded"
                  style={{
                    backgroundImage: `url(https://img.youtube.com/vi/${video.id}/hqdefault.jpg)`,
                  }}
                  aria-hidden="true"
                />
                <div className={`flex-1 text-white text-sm ${dir === "rtl" ? "text-right" : "text-left"}`}>
                  <p className="font-semibold line-clamp-2">
                    {pick(video, "title") || (lang === "en" ? "Untitled" : "بدون عنوان")}
                  </p>
                  {video.date && (
                    <p className="text-xs text-gray-400 mt-1">{video.date}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <Link
            href="/videos"
            className="inline-block bg-red-600 text-white py-2 px-6 rounded hover:bg-red-900 transition"
          >
            {viewMoreLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
