import { next } from '@vercel/edge'

export const config = {
  matcher: '/((?!_next|favicon.ico|assets).*)',
}

const ALLOWED_IPS = [
  'REPLACE_WITH_BAKERY_WIFI_IP', // The Bakery Ibiza WiFi public IP
]

export default function middleware(_request: Request) {
  // TEMPORARILY DISABLED — re-enable once bakery WiFi IP is confirmed.
  // const ip =
  //   _request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
  //   _request.headers.get('x-real-ip') ||
  //   '127.0.0.1'
  //
  // if (!ALLOWED_IPS.includes(ip)) {
  //   return new Response(
  //     `<!DOCTYPE html>
  //     <html>
  //       <body style="background:#1a1a1a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;flex-direction:column;">
  //         <h1>Members Only</h1>
  //         <p>Please connect to The Bakery WiFi to access the menu.</p>
  //       </body>
  //     </html>`,
  //     {
  //       status: 403,
  //       headers: { 'Content-Type': 'text/html' },
  //     }
  //   )
  // }

  return next()
}
