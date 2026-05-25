"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const videos = [
  {
    id: "b-RMgVZiXkc",
    title: "سليماني بعيونهم - الجزء 2",
    url: "https://www.youtube.com/watch?v=b-RMgVZiXkc",
    thumb: "https://img.youtube.com/vi/b-RMgVZiXkc/hqdefault.jpg",
    height: "h-[350px]",
  },
  {
    id: "DP11ZlNPGRg",
    title: "الأزمة الاقتصادية العالمية وأزمة 2008 هل يعيد التاريخ نفسه ؟",
    url: "https://www.youtube.com/watch?v=DP11ZlNPGRg",
    thumb: "https://img.youtube.com/vi/DP11ZlNPGRg/hqdefault.jpg",
    height: "h-[80px]",
  },
  {
    id: "9Wx-9-ucnnw",
    title: "من المسؤول عما وصلت إليه الليرة اليوم؟",
    url: "https://www.youtube.com/watch?v=9Wx-9-ucnnw",
    thumb: "https://img.youtube.com/vi/9Wx-9-ucnnw/hqdefault.jpg",
    height: "h-[80px]",
  },
  {
    id: "_iiXBbZ5FfM",
    title: "سليماني بعيونهم الجزء 1",
    url: "https://www.youtube.com/watch?v=_iiXBbZ5FfM",
    thumb: "https://img.youtube.com/vi/_iiXBbZ5FfM/hqdefault.jpg",
    height: "h-[80px]",
  },
];



export default function VideoGallery() {
  const { t, ready, i18n } = useTranslation("common");
  if (!ready) return null;

  // Only the page title translates
  const title = t("cat.videos", {
    defaultValue: i18n.language?.startsWith("en") ? "Videos" : "فيديو",
  });

  return (
    <div className="container mx-auto px-4 pb-[70px]">
      <h1 className="text-black ms-5 mb-4 text-3xl font-bold pb-[14px] pt-[50px] ltr:text-left rtl:text-right">
        {title}
      </h1>

      <div className="flex flex-col lg:flex-row mt-5 gap-6">
        {/* Left big video */}
        <div className="lg:w-1/2 w-full">
          <a href={videos[0].url} target="_blank" rel="noreferrer" className="block cursor-pointer">
            <div
              className={`relative rounded overflow-hidden flex justify-center items-center bg-center bg-cover ${videos[0].height}`}
              style={{ backgroundImage: `url(${videos[0].thumb})` }}
            >
              <i className="fas fa-play text-khandaq-orange text-5xl"></i>
            </div>
            <div className="text-لامشؤن" style={{color: "black", marginTop: "20px"}}>
                <p>{videos[0].title}</p>
                <p className="text-sm">20/07/2021</p>
              </div>
          </a>
        </div>

        {/* Right column with two videos */}
        <div className="lg:w-1/2 w-full flex flex-col gap-4">
          {videos.slice(1, 4).map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className=" text-black flex cursor-pointer items-center gap-4 bg-transparent hover:bg-gray-300 p-2 rounded transition"
            >
              <div
                className={`flex-shrink-0 rounded bg-center bg-cover ${video.height} w-24 flex justify-center items-center`}
                style={{ backgroundImage: `url(${video.thumb})` }}
              >
                <i className="fas fa-play text-khandaq-orange text-4xl"></i>
              </div>
              <div className="text-لامشؤن">
                <p>{video.title}</p>
                <p className="text-sm">20/07/2021</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
