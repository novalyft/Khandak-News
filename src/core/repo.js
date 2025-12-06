import apiService from "./apiServices.js";

// Get locale from local storage (client-side) or default (server-side)
const getLocale = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lang") || "ar"; // Default to 'ar' if not found
  }
  return "ar"; // Default for server-side rendering
};

const locale = getLocale();

// Pagination utility functions
const calculatePaginationParams = (page, limit) => {
  const start = (page - 1) * limit;
  return { start, limit };
};

const getPaginationInfo = (paginationMeta, currentPage, limit) => {
  const total = paginationMeta?.total || 0;
  const pageCount = paginationMeta?.pageCount || Math.ceil(total / limit);
  const current = paginationMeta?.page || currentPage;

  return {
    total,
    pageCount,
    current,
    hasNext: current < pageCount,
    hasPrev: current > 1,
  };
};

// Map English category IDs to API category names (direct mapping)
const mapCategoryToAPI = (categoryId) => {
  const categoryMap = {
    mhlyat: "mhlyat",
    "international-affairs": "international-affairs",
    opinion: "opinion",
    "israeli-occupation": "israeli-occupation",
    "culture-media": "culture-media",
    philosophy: "philosophy",
    africa: "africa",
    sports: "sports",
    economy: "economy",
    editorial: "editorial",
  };

  return categoryMap[categoryId] || categoryId;
};

const TOKEN = `Bearer 68aa8e860b375ed203796e994c90c4738eafe79765177a490e21940b71e23ceb8c1ee45036d2051d82816b719cd0592c6746b338a5335f056af588a73f3a4b3b7ee0d89902bdc923831d56f878abf3384c3da8272ae692b3ff8c415281107925052a92c6405234dfeeed79ff3160fe663aeda341aa08aae5e761b5f647277d6c`;

const ARTICLES_URL = "api/articles";
const EDITIONS_URL = "api/editions";
const HOME_URL = `api/homepage?populate%5B0%5D=banner&populate%5B1%5D=banner.articles&populate%5B2%5D=banner.articles.cover&populate%5B3%5D=video&populate%5B4%5D=infograpic.infographs&populate%5B5%5D=infograph2.infographs&populate%5B6%5D=localandinternationalaffairs&populate%5B7%5D=localandinternationalaffairs.local&populate%5B8%5D=localandinternationalaffairs.local.cover&populate%5B9%5D=localandinternationalaffairs.internations&populate%5B10%5D=localandinternationalaffairs.internations.cover&populate%5B11%5D=opinion&populate%5B12%5D=opinion.opinions&populate%5B13%5D=opinion.israelis&populate%5B14%5D=cultureAndPhilosophy&populate%5B15%5D=cultureAndPhilosophy.cultures&populate%5B16%5D=cultureAndPhilosophy.cultures.cover&populate%5B17%5D=cultureAndPhilosophy.philosophies&populate%5B18%5D=cultureAndPhilosophy.philosophies.cover&populate%5B19%5D=africaAndSport&populate%5B20%5D=africaAndSport.africas&populate%5B21%5D=africaAndSport.africas.cover&populate%5B22%5D=africaAndSport.sports&populate%5B23%5D=africaAndSport.sports.cover`;

const getArticles = async (limit = null, page = 1) => {
  const params = {};
  if (limit) params.limit = limit;

  // Add pagination parameters for Strapi v4
  params["pagination[page]"] = page;
  params["pagination[pageSize]"] = limit || 25;

  // Add populate parameters for cover and author
  const populateParams = "?populate%5B0%5D=cover&populate%5B1%5D=author";
  const url = `${ARTICLES_URL}${populateParams}`;

  const response = await apiService.get(url, params);
  return response.data;
};

const getByCategory = async (
  category,
  limit = null,
  locale = null,
  page = 1
) => {
  // Map English category ID to API category slug
  const apiCategory = mapCategoryToAPI(category);
  const params = { "filters[category][slug][$eq]": apiCategory };
  if (limit) params.limit = limit;
  if (locale) params.locale = locale;

  // Add pagination parameters for Strapi v4
  params["pagination[page]"] = page;
  params["pagination[pageSize]"] = limit || 25;

  // Add populate parameters for cover and author
  const populateParams = "?populate%5B0%5D=cover&populate%5B1%5D=author";
  const url = `${ARTICLES_URL}${populateParams}`;

  const response = await apiService.get(url, params);
  return response.data;
};

const getByAuthor = async (author, limit = null) => {
  const params = { author };
  if (limit) params.limit = limit;

  // Add populate parameters for cover and author
  const populateParams = "?populate%5B0%5D=cover&populate%5B1%5D=author";
  const url = `${ARTICLES_URL}${populateParams}`;

  const response = await apiService.get(url, params);
  return response.data;
};

const getArticle = async (documentId) => {
  const response = await apiService.get(
    `${ARTICLES_URL}/${documentId}?populate[0]=cover&populate[1]=author&populate[2]=author.avatar&populate[3]=articleContent&populate[5]=articleContent.image`
  );

  return response.data;
};

const getEditions = async (page = 1, pageSize = 100) => {
  // Fetch only the fields we need and let API sort newest first
  const params = {
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "fields[0]": "number",
    "fields[1]": "date",
    "fields[2]": "id",
    "sort[0]": "number:desc",
  };

  const response = await apiService.get(EDITIONS_URL, params);
  return response.data;
};

const getEditionByNumber = async (number) => {
  const params = {
    "filters[number][$eqi]": number,
  };

  // Add populate parameters for articles and their cover images
  const populateParams =
    "?populate%5B0%5D=articles&populate%5B1%5D=articles.cover&populate%5B2%5D=pdf";
  const url = `${EDITIONS_URL}${populateParams}`;

  const response = await apiService.get(url, params);

  return response.data;
};

const getHomepage = async (currentLocale = null) => {
  const localeToUse = currentLocale || getLocale();
  const response = await apiService.get(HOME_URL, { locale: localeToUse });
  return response.data;
};

const getCategory = async (locale = null) => {
  const CATEGORY_URL = "api/categories";
  const params = {};

  if (locale) {
    params.locale = locale;
  }

  // Add populate parameters if needed
  const populateParams = "?populate=*";
  const url = `${CATEGORY_URL}${populateParams}`;

  const response = await apiService.get(url, params);
  return response.data;
};

const subscribeNewsletter = async (email) => {
  const NEWSLETTER_URL = "api/news-letters";
  const data = {
    data: {
      email: email,
    },
  };

  const response = await apiService.post(NEWSLETTER_URL, data);
  return response.data;
};

// Set the token for API calls
apiService.setToken(TOKEN);

export {
  getArticles,
  getByCategory,
  getByAuthor,
  getArticle,
  getEditions,
  getEditionByNumber,
  getHomepage,
  getCategory,
  subscribeNewsletter,
  locale,
  calculatePaginationParams,
  getPaginationInfo,
  mapCategoryToAPI,
};
