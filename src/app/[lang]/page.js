import dynamic from "next/dynamic";
import IntegratedHeroSection from "../components/IntegratedHeroSection";
import { getHomepage, getAllByCategory } from "../../core/repo";
import { getCoverImageUrl } from "../../core/imageUtils";

// Revalidate every 2 minutes
export const revalidate = 120;

// Dynamic imports for better performance - these components are not immediately visible
const LocalNewsSection = dynamic(
  () => import("../components/LocalNewsSection"),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
  }
);

const InfographicsSection = dynamic(
  () => import("../components/InfographicsSection"),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded" />,
  }
);

const VideoSection = dynamic(() => import("../components/VideoSection"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded" />,
});

// Category mapping for URL-friendly IDs (using English category names)
const categoryMapping = {
  mhlyat: "mhlyat",
  "international-affairs": "international-affairs",
  opinion: "opinion",
  "israeli-occupation": "israeli-occupation",
  "culture-and-media": "culture-and-media",
  philosophy: "philosophy",
  africa: "africa",
  sports: "sports",
  economy: "economy",
  editorial: "editorial-article",
  "editorial-article": "editorial-article",
};

export default async function Home({ params }) {
  const { lang } = await params;

  // Fetch all data in parallel
  const [
    homepageData,
    localsRaw, internationalRaw, opinionRaw, israelisRaw,
    cultureRaw, philosophyRaw, africaRaw, sportsRaw,
    economyRaw, editorialRaw,
  ] = await Promise.all([
    getHomepage(lang),
    getAllByCategory("mhlyat", lang),
    getAllByCategory("international-affairs", lang),
    getAllByCategory("opinion", lang),
    getAllByCategory("israeli-occupation", lang),
    getAllByCategory("culture-and-media", lang),
    getAllByCategory("philosophy", lang),
    getAllByCategory("africa", lang),
    getAllByCategory("sports", lang),
    getAllByCategory("economy", lang),
    getAllByCategory("editorial", lang),
  ]);
  const bannerData = homepageData?.data?.banner;
  const videoData = homepageData?.data?.video;
  const infographData = homepageData?.data?.infograpic;

  const isArabic = (text = '') => /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(text);
  const matchesLang = (post) =>
    lang === 'ar' ? isArabic(post.title) : !isArabic(post.title);

  // Transform API data to match component expectations
  const transformPostData = (posts) => {
    return (
      posts
        ?.filter(matchesLang)
        ?.map((post) => ({
          title: post.title,
          date: post.edition?.date
            ? new Date(post.edition.date).toLocaleDateString("en-GB")
            : "",
          views: "0",
          image: getCoverImageUrl(post.cover) || "",
          url: `/${lang}/article/${post.documentId}`,
        })) || []
    );
  };

  const take4 = (arr) => arr.slice(0, 4);
  const localPostsFromAPI = take4(transformPostData(localsRaw));
  const internationalPostsFromAPI = take4(transformPostData(internationalRaw));
  const opinionPostsFromAPI = take4(transformPostData(opinionRaw));
  const israelisPostsFromAPI = take4(transformPostData(israelisRaw));
  const culturePostsFromAPI = take4(transformPostData(cultureRaw));
  const philosophyPostsFromAPI = take4(transformPostData(philosophyRaw));
  const africaPostsFromAPI = take4(transformPostData(africaRaw));
  const sportsPostsFromAPI = take4(transformPostData(sportsRaw));
  const economyPostsFromAPI = take4(transformPostData(economyRaw));
  const editorialPostsFromAPI = take4(transformPostData(editorialRaw));

  // Transform video data to match component expectations
  const transformVideoData = (videos) => {
    const seen = new Set();
    return (
      videos?.reduce((acc, video) => {
        if (video.videolink && !seen.has(video.videolink)) {
          seen.add(video.videolink);
          acc.push({ id: video.videolink, title_ar: video.title, date: video.date });
        }
        return acc;
      }, []) || []
    );
  };

  // Transform infograph data to match component expectations
  const transformInfographData = (infographs) => {
    return (
      infographs?.map((infograph) => ({
        title: infograph.title,
        image: getCoverImageUrl(infograph.coverImage) || "",
      })) || []
    );
  };

  const videosFromAPI = transformVideoData(videoData);
  const infographsFromAPI = transformInfographData(infographData?.infographs);

  return (
    <main className="bg-white">
      <IntegratedHeroSection bannerData={bannerData} />
      {/* <LatestIssueButton /> */}

      <LocalNewsSection
        leftTitleKey="sections.locals"
        leftHref={`/${lang}/article-category/${categoryMapping["mhlyat"]}`}
        leftPosts={localPostsFromAPI}
        rightTitleKey="sections.international"
        rightHref={`/${lang}/article-category/${categoryMapping["international-affairs"]}`}
        rightPosts={internationalPostsFromAPI}
      />
      <LocalNewsSection
        leftTitleKey="sections.economy"
        leftHref={`/${lang}/article-category/${categoryMapping["economy"]}`}
        leftPosts={economyPostsFromAPI}
        rightTitleKey="sections.editorial"
        rightHref={`/${lang}/article-category/${categoryMapping["editorial"]}`}
        rightPosts={editorialPostsFromAPI}
      />

      <VideoSection items={videosFromAPI} />

      <LocalNewsSection
        leftTitleKey="sections.opinion"
        leftHref={`/${lang}/article-category/${categoryMapping["opinion"]}`}
        leftPosts={opinionPostsFromAPI}
        rightTitleKey="sections.israelis"
        rightHref={`/${lang}/article-category/${categoryMapping["israeli-occupation"]}`}
        rightPosts={israelisPostsFromAPI}
      />

      <InfographicsSection items={infographsFromAPI} />

      <LocalNewsSection
        leftTitleKey="sections.cultureMedia"
        leftHref={`/${lang}/article-category/${categoryMapping["culture-and-media"]}`}
        leftPosts={culturePostsFromAPI}
        rightTitleKey="sections.philosophy"
        rightHref={`/${lang}/article-category/${categoryMapping["philosophy"]}`}
        rightPosts={philosophyPostsFromAPI}
      />


      <LocalNewsSection
        leftTitleKey="sections.africa"
        leftHref={`/${lang}/article-category/${categoryMapping["africa"]}`}
        leftPosts={africaPostsFromAPI}
        rightTitleKey="sections.sports"
        rightHref={`/${lang}/article-category/${categoryMapping["sports"]}`}
        rightPosts={sportsPostsFromAPI}
      />
    </main>
  );
}
