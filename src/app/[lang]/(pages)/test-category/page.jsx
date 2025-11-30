"use client";

import React, { useState, useEffect } from "react";
import { getCategory } from "@/core/repo";

const TestCategoryPage = ({ params }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locale, setLocale] = useState(params?.lang || "ar");

  const fetchCategory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategory(locale || null);
      setCategoryData(data);
    } catch (err) {
      console.error("Error fetching category:", err);
      setError(err.message || "Failed to fetch category data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCategory();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Category API</h1>

      {/* Form to test with different parameters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Locale:</label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ar">Arabic (ar)</option>
              <option value="en">English (en)</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Fetch All Categories
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading category data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Success State - Display Category Data */}
      {!loading && !error && categoryData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Category Data</h2>

          {/* Raw JSON Display */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Raw Response:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(categoryData, null, 2)}
            </pre>
          </div>

          {/* Formatted Display */}
          {categoryData.data && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Formatted Data:</h3>

              {Array.isArray(categoryData.data) ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Total Categories: {categoryData.data.length}
                  </p>
                  {categoryData.data.map((category, index) => (
                    <div
                      key={category.id || index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-semibold text-lg mb-2">
                        Category #{index + 1}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">ID:</span> {category.id}
                        </p>
                        {category.attributes && (
                          <>
                            {category.attributes.name && (
                              <p>
                                <span className="font-medium">Name:</span>{" "}
                                {category.attributes.name}
                              </p>
                            )}
                            {category.attributes.slug && (
                              <p>
                                <span className="font-medium">Slug:</span>{" "}
                                {category.attributes.slug}
                              </p>
                            )}
                            {category.attributes.description && (
                              <p>
                                <span className="font-medium">
                                  Description:
                                </span>{" "}
                                {category.attributes.description}
                              </p>
                            )}
                          </>
                        )}
                        {category.name && (
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {category.name}
                          </p>
                        )}
                        {category.slug && (
                          <p>
                            <span className="font-medium">Slug:</span>{" "}
                            {category.slug}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">ID:</span>{" "}
                      {categoryData.data.id}
                    </p>
                    {categoryData.data.attributes && (
                      <>
                        {categoryData.data.attributes.name && (
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {categoryData.data.attributes.name}
                          </p>
                        )}
                        {categoryData.data.attributes.slug && (
                          <p>
                            <span className="font-medium">Slug:</span>{" "}
                            {categoryData.data.attributes.slug}
                          </p>
                        )}
                        {categoryData.data.attributes.description && (
                          <p>
                            <span className="font-medium">Description:</span>{" "}
                            {categoryData.data.attributes.description}
                          </p>
                        )}
                      </>
                    )}
                    {categoryData.data.name && (
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {categoryData.data.name}
                      </p>
                    )}
                    {categoryData.data.slug && (
                      <p>
                        <span className="font-medium">Slug:</span>{" "}
                        {categoryData.data.slug}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Meta Information */}
              {categoryData.meta && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-2">Meta Information:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs">
                    {JSON.stringify(categoryData.meta, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* No Data State */}
      {!loading && !error && categoryData && !categoryData.data && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            No category data found in the response.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestCategoryPage;
