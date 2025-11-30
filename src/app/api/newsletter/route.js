import { NextRequest, NextResponse } from 'next/server';

const SERVER_BASE_URL = 'http://46.62.165.97:1337';
const TOKEN = `Bearer 68aa8e860b375ed203796e994c90c4738eafe79765177a490e21940b71e23ceb8c1ee45036d2051d82816b719cd0592c6746b338a5335f056af588a73f3a4b3b7ee0d89902bdc923831d56f878abf3384c3da8272ae692b3ff8c415281107925052a92c6405234dfeeed79ff3160fe663aeda341aa08aae5e761b5f647277d6c`;
const NEWSLETTER_URL = 'api/news-letters';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request body structure
    if (!body.data || !body.data.email) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { data: { email: string } }' },
        { status: 400 }
      );
    }

    // Construct the full URL to the server
    const serverUrl = `${SERVER_BASE_URL}/${NEWSLETTER_URL}`;

    // Forward the request to Strapi API
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': 'Kandak-News-Newsletter-Proxy/1.0',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Newsletter API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter', status: response.status, details: errorText },
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Newsletter proxy error:', error);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

