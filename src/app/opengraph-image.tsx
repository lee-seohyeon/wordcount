import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = '워드카운트 - 글자수세기'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 'bold', color: '#1a1a1a' }}>
          워드카운트
        </div>
        <div style={{ fontSize: 48, color: '#666666' }}>
          실시간 글자수 체크, 한 번에 해결하세요
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 