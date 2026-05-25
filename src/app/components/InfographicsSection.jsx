"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function InfographicsSection({ items = [] }) {
  const { t, i18n, ready } = useTranslation("common");

  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState("rtl");

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  // -------- utils --------
  const lang = (i18n.language || "ar").startsWith("en") ? "en" : "ar";
  const pick = (obj, base) =>
    lang === "en"
      ? obj?.[`${base}_en`] ?? obj?.[base] ?? obj?.[`${base}_ar`] ?? ""
      : obj?.[`${base}_ar`] ?? obj?.[base] ?? obj?.[`${base}_en`] ?? "";

  // open/close
  const openLightbox = (item) => {
    setActive(item);
    setOpen(true);
  };
  const closeLightbox = useCallback(() => {
    setOpen(false);
    setActive(null);
  }, []);

  // after mount (prevents SSR hydration mismatch) + keep dir in sync
  useEffect(() => {
    setMounted(true);
    const compute = () => document?.documentElement?.getAttribute("dir") || "rtl";
    setDir(compute());
    const mo = new MutationObserver(() => setDir(compute()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    return () => mo.disconnect();
  }, []);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeLightbox();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeLightbox]);

  // Block render until client + translations are ready
  if (!mounted || !ready || !items.length) return null;

  const headingAlign = dir === "rtl" ? "text-right" : "text-left";
  const closeBtnSide = dir === "rtl" ? "right-2" : "left-2";

  const sectionTitle = t("infographicsSection.title", {
    defaultValue: lang === "en" ? "Infographics" : "إنفوغرافيك",
  });
  const viewMoreLabel = t("infographicsSection.viewMore", {
    defaultValue: lang === "en" ? "View more" : "مشاهدة المزيد",
  });

  return (
    <section className="w-full bg-black py-12 mt-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className={`text-white text-3xl font-bold mb-6 ${headingAlign}`}>
          {sectionTitle}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {items.map((it, i) => {
            const title = pick(it, "title");
            const imgSrc = it.image || it.url; // support either shape
            return (
              <div key={i} className="w-full">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openLightbox(it)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && openLightbox(it)
                  }
                  className="relative cursor-pointer overflow-hidden rounded outline-none"
                  aria-label={t("infographicsSection.openAria", {
                    title,
                    defaultValue:
                      lang === "en"
                        ? `Open infographic: ${title}`
                        : `عرض الإنفوغرافيك: ${title}`,
                  })}
                >
                  <img
                    src={imgSrc}
                    alt={title}
                    className="w-full h-[380px] object-contain"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-4">
                    <div className="text-white font-semibold">{title}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/infographics"
            className="inline-block bg-red-600 text-white py-2 px-6 rounded hover:bg-red-900 transition"
          >
            {viewMoreLabel}
          </Link>
        </div>
      </div>

      {open && active && (
        <div
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.href || active.url || active.image}
              alt={pick(active, "title")}
              className="w-full h-auto rounded"
            />
            <button
              onClick={closeLightbox}
              aria-label={t("close", { defaultValue: lang === "en" ? "Close" : "إغلاق" })}
              className={`absolute top-2 ${closeBtnSide} bg-white/90 hover:bg-white rounded-full px-3 py-1 shadow`}
              type="button"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
