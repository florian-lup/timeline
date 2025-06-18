import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Timeline - AI-Powered Global Events Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
          Timeline
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.8,
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Timeline curates noteworthy events from around the world and stitches
          them into a seamless, ever-growing thread.
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
