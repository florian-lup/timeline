import { NextResponse } from 'next/server';

async function handleAnchorRequest() {
  try {
    const anchorServiceUrl = process.env['ANCHOR_SERVICE_URL'];

    if (anchorServiceUrl === undefined || anchorServiceUrl.trim() === '') {
      return NextResponse.json(
        { error: 'ANCHOR_SERVICE_URL not configured' },
        { status: 500 },
      );
    }

    // Ensure the URL has a protocol
    const normalizedUrl = anchorServiceUrl.startsWith('http')
      ? anchorServiceUrl
      : `https://${anchorServiceUrl}`;

    const startTime = Date.now();
    const apiKey = process.env['ANCHOR_API_KEY'];

    if (apiKey === undefined || apiKey.trim() === '') {
      return NextResponse.json(
        { error: 'ANCHOR_API_KEY not configured' },
        { status: 500 },
      );
    }

    const response = await fetch(`${normalizedUrl}/generate-anchor-stream`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend responded with ${String(response.status)}` },
        { status: response.status },
      );
    }

    // Check if response body exists
    if (!response.body) {
      return NextResponse.json(
        { error: 'No response body from backend' },
        { status: 500 },
      );
    }

    return createStreamingResponse(response, startTime);
  } catch (error) {
    console.error('Anchor API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate anchor broadcast' },
      { status: 500 },
    );
  }
}

function createStreamingResponse(response: Response, startTime: number) {
  const streamState = {
    chunkCount: 0,
    isCancelled: false,
  };

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();

      if (!reader) {
        controller.error(new Error('No reader available'));
        return;
      }

      await processStreamChunks(reader, controller, startTime, streamState);
    },

    cancel() {
      streamState.isCancelled = true;
    },
  });

  const headers = createResponseHeaders(response);
  return new NextResponse(stream, { headers });
}

async function processStreamChunks(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  controller: ReadableStreamDefaultController,
  startTime: number,
  streamState: { chunkCount: number; isCancelled: boolean },
) {
  try {
    while (!streamState.isCancelled) {
      const { done, value } = await reader.read();

      if (done) {
        controller.close();
        break;
      }

      const success = enqueueChunk(
        controller,
        value,
        streamState.chunkCount,
        startTime,
      );
      if (!success) {
        streamState.isCancelled = true;
        break;
      }
      streamState.chunkCount++;
    }
  } catch (error) {
    if (!streamState.isCancelled) {
      try {
        controller.error(error);
      } catch {
        // Controller might already be closed
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Reader might already be released
    }
  }
}

function enqueueChunk(
  controller: ReadableStreamDefaultController,
  value: Uint8Array,
  chunkCount: number,
  startTime: number,
): boolean {
  try {
    controller.enqueue(value);

    // Log first chunk timing for performance monitoring
    if (chunkCount === 0) {
      console.log(
        `First chunk (${String(value.byteLength)} bytes) received after ${String(Date.now() - startTime)}ms`,
      );
    }
    return true;
  } catch {
    // This happens when the client has disconnected
    return false;
  }
}

function createResponseHeaders(response: Response): Headers {
  const headers = new Headers();

  // Core streaming headers
  headers.set(
    'Content-Type',
    response.headers.get('Content-Type') ?? 'audio/wav',
  );
  headers.set('Transfer-Encoding', 'chunked');
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('Connection', 'keep-alive');

  // Forward backend-specific headers
  const taskId = response.headers.get('X-Task-ID');
  if (taskId !== null && taskId.trim() !== '') {
    headers.set('X-Task-ID', taskId);
  }

  // Forward any additional streaming headers from backend
  const contentDisposition = response.headers.get('Content-Disposition');
  if (contentDisposition !== null && contentDisposition.trim() !== '') {
    headers.set('Content-Disposition', contentDisposition);
  }

  return headers;
}

export async function POST() {
  return handleAnchorRequest();
}

export async function GET() {
  return handleAnchorRequest();
}
