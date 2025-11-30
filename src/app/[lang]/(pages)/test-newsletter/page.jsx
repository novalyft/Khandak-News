"use client";

import React, { useState } from "react";

const TestNewsletterPage = ({ params }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            email: email,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to subscribe to newsletter");
      } else {
        setResponse(data);
      }
    } catch (err) {
      console.error("Error subscribing to newsletter:", err);
      setError(err.message || "Failed to subscribe to newsletter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Newsletter API</h1>

      {/* Form to test newsletter subscription */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="subscriber@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Subscribing..." : "Subscribe to Newsletter"}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Subscribing to newsletter...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Success State - Display Response */}
      {!loading && !error && response && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-green-800">
            Subscription Successful!
          </h2>

          {/* Raw JSON Display */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Response Data:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>

          {/* Formatted Display */}
          {response.data && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Subscription Details:</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  {response.data.id && (
                    <p>
                      <span className="font-medium">ID:</span> {response.data.id}
                    </p>
                  )}
                  {response.data.documentId && (
                    <p>
                      <span className="font-medium">Document ID:</span>{" "}
                      {response.data.documentId}
                    </p>
                  )}
                  {response.data.email && (
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {response.data.email}
                    </p>
                  )}
                  {response.data.createdAt && (
                    <p>
                      <span className="font-medium">Created At:</span>{" "}
                      {new Date(response.data.createdAt).toLocaleString()}
                    </p>
                  )}
                  {response.data.updatedAt && (
                    <p>
                      <span className="font-medium">Updated At:</span>{" "}
                      {new Date(response.data.updatedAt).toLocaleString()}
                    </p>
                  )}
                  {response.data.publishedAt && (
                    <p>
                      <span className="font-medium">Published At:</span>{" "}
                      {new Date(response.data.publishedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Meta Information */}
              {response.meta && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-2">Meta Information:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs">
                    {JSON.stringify(response.meta, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestNewsletterPage;

