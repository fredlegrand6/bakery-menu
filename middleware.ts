import { next } from '@vercel/edge'

export const config = {
  matcher: '/((?!_next|favicon.ico|assets).*)',
}

const ALLOWED_IPS = [
  '88.18.132.164', // The Bakery Ibiza WiFi public IP
]

export default function middleware(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  if (!ALLOWED_IPS.includes(ip)) {
    return new Response(
      `<!DOCTYPE html>
      <html>
        <body style="background:#1a1a1a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;flex-direction:column;">
          <h1>Members Only</h1>
          <p>Please connect to The Bakery WiFi to access the menu.</p>
        </body>
      </html>`,
      {
        status: 403,
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }

  return next()
}
