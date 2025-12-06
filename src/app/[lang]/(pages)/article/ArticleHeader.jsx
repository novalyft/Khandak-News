import React from "react";

const ArticleHeader = ({
  coverImage,
  description,
  authorName,
  authorImage,
  authorLink = "",
}) => {
  return (
    <div
      className="relative w-full min-h-[400px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: coverImage
          ? `url('${coverImage}')`
          : "url('https://al-khandak.com/storage/posts/old/1587485208_1928897977.jpeg')",
      }}
    >
      {/* Text Box */}
      {description && (
        <div className="absolute top-4 right-4 p-3 bg-[rgba(0,0,0,0.6)] aspect-square w-[90vw] max-w-[250px]">
          <p
            className="text-white text-sm md:text-base leading-relaxed"
            dir="rtl"
          >
            {description}
          </p>
        </div>
      )}

      {/* Author Section */}
      {(authorName || authorImage) && (
        <a href={authorLink}>
          <div className="absolute bottom-[10px] right-[10px] bg-black/55 rounded-[150px_500px_500px_150px] flex items-center gap-4 px-4 py-2 mb-[-50]">
            {authorImage && (
              <div
                className="rounded-full w-[120px] h-[120px] bg-cover bg-center bg-no-repeat "
                style={{
                  backgroundImage: `url('${authorImage}')`,
                }}
              ></div>
            )}
            {authorName && (
              <p className="text-white text-lg m-0">{authorName}</p>
            )}
          </div>
        </a>
      )}
    </div>
  );
};

export default ArticleHeader;
