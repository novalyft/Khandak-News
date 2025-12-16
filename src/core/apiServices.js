let token = "";

const generateHeader = (userHeader = {}) => {
  return {
    Authorization: token,
    "Content-Type": "application/json",
    ...userHeader,
  };
};

const generatePath = (path = "") => {
  return `http://46.62.165.97:1337/${path}`;
};

export const get = async (path, params, header = {}) => {
  let fullPath = generatePath(path);

  // If path already has query parameters, we need to handle them separately
  const [basePath, existingQuery] = fullPath.split("?");
  const url = new URL(basePath);

  // Add existing query parameters if they exist
  if (existingQuery) {
    existingQuery.split("&").forEach((param) => {
      const [key, value] = param.split("=");
      if (key && value) {
        url.searchParams.append(
          decodeURIComponent(key),
          decodeURIComponent(value)
        );
      }
    });
  }

  // Add new query parameters from params
  if (params) {
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key]);
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: generateHeader(header),
    next: { revalidate: 120 }, // Revalidate every 2 minutes
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data };
};

export const post = async (path, data, header = {}) => {
  const response = await fetch(generatePath(path), {
    method: "POST",
    headers: generateHeader(header),
    body: JSON.stringify(data),
    // No revalidation for POST (mutating operation)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  return { data: responseData };
};

export const put = async (path, data, header = {}) => {
  const response = await fetch(generatePath(path), {
    method: "PUT",
    headers: generateHeader(header),
    body: JSON.stringify(data),
    // No revalidation for PUT (mutating operation)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  return { data: responseData };
};

export const deleteRequest = async (path, params, headers = {}) => {
  const url = new URL(generatePath(path));

  // Add query parameters
  if (params) {
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key]);
    });
  }

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: generateHeader(headers),
    // No revalidation for DELETE (mutating operation)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data };
};

export const setToken = (t) => {
  token = t || token;
};

const apiService = {
  get,
  post,
  put,
  deleteRequest,
  setToken,
};

export default apiService;
