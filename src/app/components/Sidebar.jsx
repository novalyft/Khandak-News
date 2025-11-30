"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  FaChevronLeft,
  FaChevronRight,
  FaBullhorn,
  FaStarOfDavid,
  FaGlobe,
  FaMapMarkerAlt,
  FaComments,
  FaFlag,
  FaBook,
  FaTheaterMasks,
  FaBasketballBall,
} from "react-icons/fa";

export default function Sidebar({
  isOpen,
  setIsOpen,
  side,
  widthClass = "w-64",
  lang = "ar",
}) {
  const { t } = useTranslation("common");

  // Track <html dir> and map to side when no explicit prop is given
  const [autoSide, setAutoSide] = useState("right");
  useEffect(() => {
    const compute = () =>
      (document?.documentElement?.getAttribute("dir") || "rtl") === "rtl"
        ? "right"
        : "left";
    setAutoSide(compute());
    const mo = new MutationObserver(() => setAutoSide(compute()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    return () => mo.disconnect();
  }, []);

  const effectiveSide = side || autoSide; // "right" for RTL, "left" for LTR
  const isLeft = effectiveSide === "left";

  // When CLOSED, don't animate transform (prevents the cross-screen slide on lang toggle)
  const transitionClass = isOpen
    ? "transition-transform duration-300"
    : "transition-none";

  // Position & transform
  const sideClass = isLeft ? "left-0" : "right-0";
  const translateClosed = isLeft ? "-translate-x-full" : "translate-x-full";
  const panelTransform = isOpen ? "translate-x-0" : translateClosed;

  const closeBtnSide = isLeft ? "right-2" : "left-2";
  const Chevron = isLeft ? FaChevronLeft : FaChevronRight;

  const menuItems = useMemo(() => {
    const basePaths = [
      { label: t("home"), icon: <Chevron />, path: "/" },
      {
        label: t("cat.editorial"),
        icon: <FaBullhorn />,
        path: "/article-category/editorial-article",
      },
      {
        label: t("cat.israelis"),
        icon: <FaStarOfDavid />,
        path: "/article-category/israeli-occupation",
      },
      {
        label: t("cat.international"),
        icon: <FaGlobe />,
        path: "/article-category/international-affairs",
      },
      {
        label: t("cat.africa"),
        icon: <FaFlag />,
        path: "/article-category/africa",
      },
      {
        label: t("cat.locals"),
        icon: <FaMapMarkerAlt />,
        path: "/article-category/mhlyat",
      },
      {
        label: t("cat.opinion"),
        icon: <FaComments />,
        path: "/article-category/opinion",
      },
      {
        label: t("cat.economy"),
        icon: <FaFlag />,
        path: "/article-category/economy",
      },
      {
        label: t("cat.philosophy"),
        icon: <FaBook />,
        path: "/article-category/philosophy",
      },
      {
        label: t("cat.cultureMedia"),
        icon: <FaTheaterMasks />,
        path: "/article-category/culture-media",
      },
      {
        label: t("cat.sports"),
        icon: <FaBasketballBall />,
        path: "/article-category/sports",
      },
      { label: t("cat.folders"), icon: null, path: "/folders" },
      { label: t("cat.videos"), icon: null, path: "/videos" },
      { label: t("cat.infographics"), icon: null, path: "/infographics" },
      { label: t("cat.contact"), icon: null, path: "/contact-us" },
    ];

    // Prepend language prefix to all paths except home
    return basePaths.map((item) => ({
      ...item,
      path: item.path === "/" ? `/${lang}` : `/${lang}${item.path}`,
    }));
  }, [t, isLeft, lang]);

  // Esc to close + lock scroll
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && isOpen && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, setIsOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      dir="auto"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        className={`absolute top-0 ${sideClass} h-full ${widthClass} bg-gray-100 text-black p-4 overflow-y-auto
          ${transitionClass} z-40 scrollbar-hide ${panelTransform}`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label={t("close")}
          className={`absolute top-2 ${closeBtnSide} rounded p-2 text-gray-600 hover:bg-black/5`}
        >
          ✕
        </button>

        <ul className="space-y-6 text-lg mt-10">
          {menuItems.map(({ label, icon, path }, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <Link
                href={path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 hover:text-red-600"
              >
                {icon && <span className="text-xl">{icon}</span>}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
