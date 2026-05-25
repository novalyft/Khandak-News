"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getCoverImageUrl } from "../../core/imageUtils";

export default function HeroSection({ bannerData }) {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState("rtl");

  useEffect(() => {
    setMounted(true);

    const compute = () =>
      document?.documentElement?.getAttribute("dir") || "rtl";
    setDir(compute());

    const mo = new MutationObserver(() => setDir(compute()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => mo.disconnect();
  }, []);

  if (!mounted) return null;

  const sideClass = dir === "rtl" ? "right-5" : "left-5";

  // Get the first article from banner data if available
  const featuredArticle = bannerData?.articles?.[0];
  const backgroundImage = getCoverImageUrl(featuredArticle?.cover) || "https://al-khandak.com/storage/posts/March2025/Oi8mhhMp1FSWiw5Gp1AR.jpg";

  return (
    <div className="carousel-item">
      <div
        className="w-full relative bg-cover bg-center min-h-[400px]"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      >
        {/* Overlay box (flips with dir) */}
        <div
          className={`absolute bottom-5 ${sideClass} bg-black/60 p-4 max-w-sm`}
        >
          {featuredArticle ? (
            <>
              <h2 className="text-white text-lg font-bold mb-2">
                {featuredArticle.title}
              </h2>
              <p className="text-white text-sm mb-2">
                {featuredArticle.description}
              </p>
              <Link
                href={`/article/${featuredArticle.documentId}`}
                className="text-white underline hover:text-gray-200 text-sm"
              >
                {t("hero.readMore")}
              </Link>
            </>
          ) : (
            <>
              <p className="text-white text-sm mb-2">
                {t(
                  "أججت فضيحة اغتصاب أسير فلسطيني نهاية شهر يوليو/تموز العام الماضي مجتمع  بعد اعتقال الجنود المتهمين بجريمة الاغتصاب والتعذيب"
                )}
              </p>
              <Link
                href="/article"
                className="text-white underline hover:text-gray-200 text-sm"
              >
                {t("hero.readMore")}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
