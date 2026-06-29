"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";

function PostCard({ url, image, title, date }) {
  return (
    <Link
      href={url}
      className="block w-full py-2 px-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
    >
      <div className="flex flex-row">
        <div
          className="w-1/3 min-h-[130px] bg-center bg-no-repeat bg-cover border-r"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className="flex-1 flex flex-col justify-end px-4">
          <p className="text-gray-700">{title}</p>
          <div className="flex justify-start items-center gap-3 mt-2 text-gray-700">
            <p className="flex items-center space-x-1">
              <i className="fas fa-clock text-[13px]" />
              <span>{date}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PostsList({ posts = [] }) {
  const { t } = useTranslation("common");

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-red-600 text-start">
        {t("authorCard.relatedPosts")}
      </h1>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          url={post.url}
          image={post.image}
          title={post.title}
          date={post.date}
        />
      ))}
    </div>
  );
}
