import { NextResponse } from 'next/server';
import { createClient } from 'pexels';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  if (!process.env.PEXELS_API_KEY) {
    console.error('Pexels API key is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const client = createClient(process.env.PEXELS_API_KEY);

  try {
    const response = await client.photos.search({ query, per_page: 1 });
    
    if ('photos' in response && response.photos.length > 0) {
      const imageUrl = response.photos[0].src.large;
      return NextResponse.json({ imageUrl });
    } else {
      return NextResponse.json({ imageUrl: null }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching image from Pexels:', error);
    if (error instanceof Error && 'status' in error && error.status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Failed to fetch image from Pexels' }, { status: 500 });
  }
}
