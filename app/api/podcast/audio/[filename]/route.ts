import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Proxy route for audio files to avoid CORS issues during development
 * Streams audio content from the CDN through our API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params;

    // Validate filename format (UUID + .wav extension)
    if (!RegExp(/^[a-f0-9-]{36}\.wav$/).exec(filename)) {
      return new NextResponse('Invalid filename format', { status: 400 });
    }

    // Construct the CDN URL
    const cdnUrl = `https://timeline.supply/podcasts/${filename}`;

    // Fetch the audio file from the CDN
    const response = await fetch(cdnUrl);

    if (!response.ok) {
      return new NextResponse('Audio file not found', { status: 404 });
    }

    // Get the audio data as a stream
    const audioStream = response.body;

    if (!audioStream) {
      return new NextResponse('Failed to stream audio', { status: 500 });
    }

    // Return the audio with proper headers
    return new NextResponse(audioStream, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Content-Length': response.headers.get('Content-Length') ?? '',
      },
    });
  } catch (error) {
    console.error('Error proxying audio file:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
