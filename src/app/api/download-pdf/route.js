import { NextResponse } from 'next/server';
import { getEditionByNumber, getEditions } from '@/core/repo';

export const revalidate = 120;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const editionNumber = searchParams.get('editionNumber');

    let editionData = null;

    if (editionNumber) {
      editionData = await getEditionByNumber(editionNumber);
    } else {
      const editionsResponse = await getEditions(1, 1);
      let editionsArray = [];
      if (Array.isArray(editionsResponse)) {
        editionsArray = editionsResponse;
      } else if (Array.isArray(editionsResponse?.data)) {
        editionsArray = editionsResponse.data;
      } else if (Array.isArray(editionsResponse?.data?.data)) {
        editionsArray = editionsResponse.data.data;
      }

      if (editionsArray.length === 0) {
        return NextResponse.json({ error: 'No editions found' }, { status: 404 });
      }

      editionData = await getEditionByNumber(editionsArray[0].number);
    }

    let edition = null;
    if (Array.isArray(editionData)) {
      edition = editionData[0];
    } else if (Array.isArray(editionData?.data)) {
      edition = editionData.data[0];
    } else if (Array.isArray(editionData?.data?.data)) {
      edition = editionData.data.data[0];
    }

    if (!edition) {
      return NextResponse.json({ error: 'Edition not found' }, { status: 404 });
    }

    // Extract PDF URL
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
      return NextResponse.json({ error: 'No PDF available for this edition' }, { status: 404 });
    }

    if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
      pdfUrl = `http://46.62.165.97:1337${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
    }

    // Proxy PDF through Next.js so browser triggers a real file download
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch PDF from storage' }, { status: 502 });
    }

    const filename = `edition-${edition.number || 'latest'}.pdf`;
    return new NextResponse(pdfResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF download error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
