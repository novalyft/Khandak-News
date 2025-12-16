import { NextResponse } from 'next/server';
import { getEditionByNumber, getEditions } from '@/core/repo';

// Revalidate every 2 minutes
export const revalidate = 120;

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const editionNumber = searchParams.get('editionNumber');

    let editionData = null;

    if (editionNumber) {
      // Fetch specific edition by number
      editionData = await getEditionByNumber(editionNumber);
    } else {
      // Fetch latest edition (highest number)
      const editionsResponse = await getEditions(1, 1);
      
      // Handle different possible response structures
      let editionsArray = [];
      if (Array.isArray(editionsResponse)) {
        editionsArray = editionsResponse;
      } else if (editionsResponse?.data && Array.isArray(editionsResponse.data)) {
        editionsArray = editionsResponse.data;
      } else if (editionsResponse?.data?.data && Array.isArray(editionsResponse.data.data)) {
        editionsArray = editionsResponse.data.data;
      }

      if (editionsArray.length === 0) {
        return NextResponse.json(
          { error: 'No editions found' },
          { status: 404 }
        );
      }

      // Get the latest edition number (first one since sorted by number:desc)
      const latestEditionNumber = editionsArray[0].number;
      
      // Fetch full edition data with PDF
      editionData = await getEditionByNumber(latestEditionNumber);
    }

    // Handle different possible response structures
    let edition = null;
    if (Array.isArray(editionData)) {
      edition = editionData[0];
    } else if (editionData?.data && Array.isArray(editionData.data)) {
      edition = editionData.data[0];
    } else if (editionData?.data?.data && Array.isArray(editionData.data.data)) {
      edition = editionData.data.data[0];
    }

    if (!edition) {
      return NextResponse.json(
        { error: 'Edition not found' },
        { status: 404 }
      );
    }

    // Extract PDF URL from edition
    // PDF structure in Strapi v4: pdf.url or pdf.data.url
    let pdfUrl = null;
    if (edition.pdf) {
      if (typeof edition.pdf === 'string') {
        pdfUrl = edition.pdf;
      } else if (edition.pdf.url) {
        pdfUrl = edition.pdf.url;
      } else if (edition.pdf.data?.url) {
        pdfUrl = edition.pdf.data.url;
      }
    }

    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'PDF not found for this edition' },
        { status: 404 }
      );
    }

    // Ensure PDF URL is absolute
    if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
      pdfUrl = `http://46.62.165.97:1337${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
    }

    // Redirect to PDF URL to trigger download
    return NextResponse.redirect(pdfUrl, { status: 302 });
  } catch (error) {
    console.error('PDF download error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

