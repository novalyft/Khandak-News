import { NextResponse } from 'next/server';
import { getCategory } from '@/core/repo';

export async function GET(request) {
  try {
    // Get locale from query parameters (optional)
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || null;

    // Fetch all categories using the repo function
    const categoriesData = await getCategory(locale);

    // Return the categories data as JSON
    return NextResponse.json(categoriesData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        message: error.message || 'Unknown error'
      },
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

