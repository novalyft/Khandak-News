"use client";

import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            email: email,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to subscribe to newsletter");
      } else {
        setSuccess(true);
        setEmail(""); // Clear the email field on success
        // Reset success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error subscribing to newsletter:", err);
      setError(err.message || "Failed to subscribe to newsletter");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    [t("cat.editorial"), "article-category/editorial"],
    [t("cat.israelis"), "article-category/israeli-occupation"],
    [t("cat.international"), "article-category/international-affairs"],
    [t("cat.africa"), "article-category/africa"],
    [t("cat.locals"), "article-category/mhlyat"],
    [t("cat.opinion"), "article-category/opinion"],
    [t("cat.economy"), "article-category/economy"],
    [t("cat.philosophy"), "article-category/philosophy"],
    [t("cat.cultureMedia"), "article-category/culture-media"],
    [t("cat.sports"), "article-category/sports"],
    [t("cat.folders"), "folders"],
    [t("cat.videos"), "videos"],
    [t("cat.infographics"), "infographics"],
    [t("cat.privacy"), "privacy-policy"],
    [t("cat.contact"), "contact-us"],
  ];

  return (
    <div className="w-full bg-gray-100">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="bg-gray-300 text-black p-6 md:w-1/4 w-full text-center">
            <p className="mb-4">{t("newsletter.title")}</p>

            <form onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                name="subscribe-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletter.emailPlaceholder")}
                required
                disabled={loading}
                className="w-full px-3 py-2 rounded text-black bg-white disabled:opacity-50"
              />

              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 mx-auto cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                <PaperAirplaneIcon className="w-5 h-5 -rotate-45 group-hover:translate-x-1 transition-transform" />
                {loading
                  ? t("newsletter.subscribing") || "Subscribing..."
                  : t("newsletter.subscribe")}
              </button>
            </form>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {success && (
              <p className="mt-2 text-sm text-green-600">
                {t("newsletter.success") || "Successfully subscribed!"}
              </p>
            )}
          </div>

          <div
            className="
              w-full flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mt-10
              justify-center             /* center the grid tracks if narrower */
              justify-items-center md:justify-items-start  /* center each column on mobile */
            "
          >
            {[
              categories.slice(0, 3),
              categories.slice(3, 6),
              categories.slice(6, 9),
              categories.slice(9, 10),
              categories.slice(10, 13),
              categories.slice(13, 16),
            ].map((group, i) => (
              <ul
                key={i}
                className="list-none space-y-2 text-sm text-center md:text-start"
              >
                {group.map(([label, path]) => (
                  <li key={path}>
                    <Link
                      href={`/${path}`}
                      className="text-gray-800 hover:text-red-600 transition-colors duration-200 cursor-pointer font-bold"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
