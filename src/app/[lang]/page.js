import dynamic from "next/dynamic";
import IntegratedHeroSection from "../components/IntegratedHeroSection";
import { getHomepage } from "../../core/repo";
import { getCoverImageUrl } from "../../core/imageUtils";

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

const LatestIssueButton = dynamic(
  () => import("../components/LatestIssueButton"),
  {
    loading: () => null, // Don't show loading for this small component
  }
);

// Category mapping for URL-friendly IDs (using English category names)
const categoryMapping = {
  mhlyat: "mhlyat",
  "international-affairs": "international-affairs",
  opinion: "opinion",
  "israeli-occupation": "israeli-occupation",
  "culture-and-media": "culture-media",
  philosophy: "philosophy",
  africa: "africa",
  sports: "sports",
  economy: "economy",
  "editorial-article": "editorial",
};

export default async function Home({ params }) {
  const { lang } = params;

  // Fetch homepage data with the current language
  const homepageData = await getHomepage(lang);
  const bannerData = homepageData?.data?.banner;
  const localAndInternationalData =
    homepageData?.data?.localandinternationalaffairs;
  const videoData = homepageData?.data?.video;
  const opinionData = homepageData?.data?.opinion;
  const cultureAndPhilosophyData = homepageData?.data?.cultureAndPhilosophy;
  const africaAndSportData = homepageData?.data?.africaAndSport;
  const infographData = homepageData?.data?.infograpic;

  // Transform API data to match component expectations
  const transformPostData = (posts) => {
    return (
      posts?.map((post) => ({
        title: post.title,
        date:
          post.datePublished ||
          new Date(post.publishedAt).toLocaleDateString("en-GB"),
        views: "0", // API doesn't provide view count
        image: getCoverImageUrl(post.cover) || "",
        url: `/${lang}/article/${post.documentId}`,
      })) || []
    );
  };

  const localPostsFromAPI = transformPostData(localAndInternationalData?.local);
  const internationalPostsFromAPI = transformPostData(
    localAndInternationalData?.internations
  );
  const opinionPostsFromAPI = transformPostData(opinionData?.opinions);
  const israelisPostsFromAPI = transformPostData(opinionData?.israelis);
  const culturePostsFromAPI = transformPostData(
    cultureAndPhilosophyData?.cultures
  );
  const philosophyPostsFromAPI = transformPostData(
    cultureAndPhilosophyData?.philosophies
  );
  const africaPostsFromAPI = transformPostData(africaAndSportData?.africas);
  const sportsPostsFromAPI = transformPostData(africaAndSportData?.sports);

  // Transform video data to match component expectations
  const transformVideoData = (videos) => {
    return (
      videos?.map((video) => ({
        id: video.videolink,
        title_ar: video.title,
        date: video.date,
      })) || []
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

      <InfographicsSection items={infographsFromAPI} />

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
