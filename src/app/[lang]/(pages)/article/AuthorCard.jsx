"use client";
import { useTranslation } from "react-i18next";

const posts = [
  {
    id: 1,
    imageUrl: "https://al-khandak.com/storage/posts/old/1615483501_64475813.jpeg",
    title: `'إعادة ضبط كبيرة'" نعم، ولتَكن حقيقية (1)"`,
    date: "13/11/2021",
    newsCount: 9,
  },
  {
    id: 2,
    imageUrl: "https://al-khandak.com/storage/posts/old/1615483501_64475813.jpeg",
    title: "عنوان المقال الثاني",
    date: "22/12/2022",
    newsCount: 15,
  },
  {
    id: 3,
    imageUrl: "https://al-khandak.com/storage/posts/old/1615483501_64475813.jpeg",
    title: "عنوان المقال الثالث",
    date: "05/01/2023",
    newsCount: 3,
  },
  {
    id: 4,
    imageUrl: "https://al-khandak.com/storage/posts/old/1615483501_64475813.jpeg",
    title: "عنوان المقال الرابع",
    date: "05/01/2023",
    newsCount: 4,
  },
];

function PostCard({ imageUrl, title, date, newsCount }) {
  return (
    <div className="w-full py-2 px-4 border-b border-gray-200 last:border-b-0">
      <div className="flex flex-row">

        <div
          className="w-1/3 min-h-[130px] bg-center bg-no-repeat bg-cover border-r"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="flex-1 flex flex-col justify-end px-4">
          <p className="text-gray-700">{title}</p>
          <div className="flex justify-start items-center gap-3 mt-2 text-gray-700">
            <p className="flex items-center space-x-1">
              <i className="fas fa-clock text-[13px]" />
              <span>{date}</span>
            </p>
            <p className="flex items-center space-x-1">
              <i className="fas fa-newspaper text-[13px]" />
              <span>{newsCount}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostsList() {
  const { t } = useTranslation("common");
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-red-600 text-start">
        {t("authorCard.relatedPosts")}
      </h1>

      {posts.map(({ id, imageUrl, title, date, newsCount }) => (
        <PostCard
          key={id}
          imageUrl={imageUrl}
          title={title}
          date={date}
          newsCount={newsCount}
        />
      ))}
    </div>
  );
}
