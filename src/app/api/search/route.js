import { NextRequest, NextResponse } from 'next/server';

// Revalidate every 2 minutes
export const revalidate = 120;

const SERVER_BASE_URL = 'http://46.62.165.97:1337';
const TOKEN = `Bearer 68aa8e860b375ed203796e994c90c4738eafe79765177a490e21940b71e23ceb8c1ee45036d2051d82816b719cd0592c6746b338a5335f056af588a73f3a4b3b7ee0d89902bdc923831d56f878abf3384c3da8272ae692b3ff8c415281107925052a92c6405234dfeeed79ff3160fe663aeda341aa08aae5e761b5f647277d6c`;
const ARTICLES_URL = 'api/articles';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const titleQuery = searchParams.get('titleQuery') || searchParams.get('q');
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || searchParams.get('limit') || '25';
    const locale = searchParams.get('locale');

    // Validate that titleQuery is provided
    if (!titleQuery) {
      return NextResponse.json(
        { error: 'Missing required parameter: titleQuery or q' },
        { status: 400 }
      );
    }

    // Build query parameters for Strapi API
    const params = new URLSearchParams({
      'filters[title][$containsi]': titleQuery,
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
    });

    // Add locale if provided
    if (locale) {
      params.append('locale', locale);
    }

    // Construct the full URL to the server with populate=*
    const serverUrl = `${SERVER_BASE_URL}/${ARTICLES_URL}?populate=*&${params.toString()}`;

    // Fetch articles from the server
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': 'Kandak-News-Search-Proxy/1.0',
      },
      next: { revalidate: 120 }, // Revalidate every 2 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Search API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to search articles', status: response.status },
        { status: response.status }
      );
    }

    // Get the JSON data
    const data = await response.json();

    // Return the data with appropriate headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Search proxy error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

