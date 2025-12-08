import Link from "next/link";
import { getCoverImageUrl, getFallbackImageUrl } from "../../../../core/imageUtils";

const ArticleCard = ({ article, index, lang = "ar" }) => {
  const coverImage = getCoverImageUrl(article.cover) || getFallbackImageUrl();

  const articleLink = `/${lang}/article/${article.documentId}`;
  return (
    <Link
      href={articleLink}
      className="block group rounded overflow-hidden shadow-lg"
    >
      <div className="relative">
        <img
          src={coverImage}
          alt={article.title}
          className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
          <div className="flex items-center text-gray-300 text-sm space-x-4 rtl:space-x-reverse">
            <p className="flex items-center gap-1">
              <i className="fas fa-clock text-xs"></i>
              {new Date(article.createdAt).toLocaleDateString("ar-SA")}
            </p>
            <p className="flex items-center gap-1">
              <i className="fas fa-newspaper text-xs"></i>
              {article.views || 0}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
