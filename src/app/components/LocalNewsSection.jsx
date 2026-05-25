"use client";
import React, { useEffect, useState } from "react";
import { CalendarDays, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LocalNewsSection({
  // EITHER pass a translation key...
  leftTitleKey,
  rightTitleKey,
  // ...OR pass a plain string title (fallback if key missing)
  leftTitle,
  rightTitle,
  leftHref,
  rightHref,
  leftPosts = [],
  rightPosts = [],
}) {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState("rtl");

  useEffect(() => {
    setMounted(true);
    const getDir = () => document?.documentElement?.getAttribute("dir") || "rtl";
    setDir(getDir());
    const mo = new MutationObserver(() => setDir(getDir()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    return () => mo.disconnect();
  }, []);

  if (!mounted) return null;

  const Chevron = dir === "rtl" ? ChevronLeft : ChevronRight;

  const leftTitleText  = leftTitleKey  ? t(leftTitleKey,  { defaultValue: leftTitle  ?? leftTitleKey  }) : (leftTitle  ?? "");
  const rightTitleText = rightTitleKey ? t(rightTitleKey, { defaultValue: rightTitle ?? rightTitleKey }) : (rightTitle ?? "");

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 pb-[70px]">
      <div className="flex flex-col md:flex-row">
        {/* Left Column */}
        <div className="w-full md:w-1/2 md:pe-6 border-gray-300 md:border-e">
          <h4 className="text-orange-600 mb-4 ms-5 font-bold text-lg">
            <a
              href={leftHref}
              className="text-black hover:text-orange-700 flex items-center gap-2 cursor-pointer"
            >
              {leftTitleText}
              <Chevron size={18} />
            </a>
          </h4>

          {leftPosts.map((post, idx) => (
            <div key={idx} className="p-4">
              <a href={post.url} className="no-underline text-black hover:opacity-80">
                <div className="flex gap-4">
                  <div
                    className="w-1/3 min-h-[130px] bg-center bg-cover"
                    style={{ backgroundImage: `url('${post.image}')` }}
                  />
                  <div className="flex flex-col justify-end flex-1">
                    <p className="text-sm font-medium">{post.title}</p>
                    <div className="flex text-gray-600 text-xs gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {post.date}
                      </span>
                      {/* <span className="flex items-center gap-1">
                        <Newspaper size={14} />
                        {post.views}
                      </span> */}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 md:ps-6 mt-10 md:mt-0">
          <h4 className="text-orange-600 mb-4 ms-5 font-bold text-lg">
            <a
              href={rightHref}
              className="text-black hover:text-orange-700 flex items-center gap-2 cursor-pointer"
            >
              {rightTitleText}
              <Chevron size={18} />
            </a>
          </h4>

          {rightPosts.map((post, idx) => (
            <div key={idx} className="p-4">
              <a href={post.url} className="no-underline text-black hover:opacity-80">
                <div className="flex gap-4">
                  <div
                    className="w-1/3 min-h-[130px] bg-center bg-cover"
                    style={{ backgroundImage: `url('${post.image}')` }}
                  />
                  <div className="flex flex-col justify-end flex-1">
                    <p className="text-sm font-medium">{post.title}</p>
                    <div className="flex text-gray-600 text-xs gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {post.date}
                      </span>
                      {/* <span className="flex items-center gap-1">
                        <Newspaper size={14} />
                        {post.views}
                      </span> */}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
