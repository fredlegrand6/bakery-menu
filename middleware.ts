import { next } from '@vercel/edge'

export const config = {
  matcher: '/((?!_next|favicon.ico|assets).*)',
}

// The Bakery Ibiza WiFi — CIDR /28 covers .160–.175
// Movistar dynamic IP rotates within this DHCP pool
const ALLOWED_CIDRS = [
  '88.18.132.160/28',
]

function ipToInt(ip: string): number {
  const parts = ip.split('.')
  if (parts.length !== 4) return -1
  return (
    (parseInt(parts[0], 10) << 24) +
    (parseInt(parts[1], 10) << 16) +
    (parseInt(parts[2], 10) << 8) +
    parseInt(parts[3], 10)
  ) >>> 0
}

function ipInCidr(ip: string, cidr: string): boolean {
  const [range, bitsStr] = cidr.split('/')
  const bits = parseInt(bitsStr, 10)
  const ipInt = ipToInt(ip)
  const rangeInt = ipToInt(range)
  if (ipInt < 0 || rangeInt < 0) return false
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0
  return (ipInt & mask) === (rangeInt & mask)
}

export default function middleware(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  const allowed = ALLOWED_CIDRS.some((cidr) => ipInCidr(ip, cidr))

  if (!allowed) {
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
