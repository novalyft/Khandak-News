"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";

export default function VideoGallery() {
  const { t, ready, i18n } = useTranslation("common");
  const params = useParams();
  const lang = params?.lang || (i18n.language?.startsWith("en") ? "en" : "ar");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/videos?locale=${lang}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }
        const data = await response.json();

        // Dedup by youtube id and map to display shape
        const seen = new Set();
        const list = (data.data || []).reduce((acc, video) => {
          if (video.videolink && !seen.has(video.videolink)) {
            seen.add(video.videolink);
            acc.push({
              id: video.videolink,
              title: video.title,
              date: video.date,
              url: `https://www.youtube.com/watch?v=${video.videolink}`,
              thumb: `https://img.youtube.com/vi/${video.videolink}/hqdefault.jpg`,
            });
          }
          return acc;
        }, []);

        setVideos(list);
        setActiveVideo(list[0]?.id || "");
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (ready) {
      fetchVideos();
    }
  }, [lang, ready]);

  if (!ready) return null;

  const title = t("cat.videos", {
    defaultValue: i18n.language?.startsWith("en") ? "Videos" : "فيديو",
  });

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <h1 className="text-black ms-5 mb-4 text-3xl font-bold pb-[14px] pt-[50px] ltr:text-left rtl:text-right">
        {title}
      </h1>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {lang === "en" ? "Loading..." : "جاري التحميل..."}
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">
            {lang === "en" ? `Error: ${error}` : `خطأ: ${error}`}
          </p>
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {lang === "en" ? "No videos found" : "لا توجد فيديوهات متاحة"}
          </p>
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <div className="flex flex-col lg:flex-row mt-5 gap-6">
          {/* Main player */}
          <div className="lg:w-1/2 w-full">
            {activeVideo && (
              <iframe
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

          {/* List of all videos */}
          <div className="lg:w-1/2 w-full flex flex-col gap-4 max-h-[420px] overflow-y-auto">
            {videos.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveVideo(video.id)}
                className={`flex cursor-pointer items-center gap-4 p-2 rounded transition ${
                  activeVideo === video.id
                    ? "bg-gray-200"
                    : "bg-transparent hover:bg-gray-100"
                } ${lang === "ar" ? "text-right" : "text-left"}`}
              >
                <div
                  className="flex-shrink-0 rounded bg-center bg-cover h-20 w-28 flex justify-center items-center"
                  style={{ backgroundImage: `url(${video.thumb})` }}
                >
                  <i className="fas fa-play text-white text-3xl drop-shadow" />
                </div>
                <div className="flex-1 text-black">
                  <p className="font-semibold line-clamp-2">
                    {video.title || (lang === "en" ? "Untitled" : "بدون عنوان")}
                  </p>
                  {video.date && (
                    <p className="text-sm text-gray-500 mt-1">{video.date}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
