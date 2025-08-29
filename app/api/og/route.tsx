import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0ea5e9',
          color: 'white',
          fontSize: 64,
        }}
      >
        Jensy Jimenez
      </div>
    ),
  );
}
