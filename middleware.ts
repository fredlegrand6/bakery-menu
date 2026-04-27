import { next } from '@vercel/edge'

export const config = {
  matcher: '/((?!_next|favicon.ico|assets).*)',
}

// The Bakery Ibiza WiFi — CIDR /28 covers .160–.175
// Movistar dynamic IP rotates within this DHCP pool
const ALLOWED_CIDRS = [
  '88.18.132.160/28',
]

// Fallback unlock for users blocked by iCloud Private Relay, IPv6, etc.
const MEMBER_PIN = '0420'
const COOKIE_NAME = 'bakery_member'
const COOKIE_VALUE = 'unlocked-v1'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

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

function hasUnlockCookie(request: Request): boolean {
  const cookie = request.headers.get('cookie') || ''
  return cookie.split(';').some((c) => c.trim() === `${COOKIE_NAME}=${COOKIE_VALUE}`)
}

const PAGE_BASE_STYLES =
  'background:#1a1a1a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;flex-direction:column;padding:0 24px;text-align:center;box-sizing:border-box;'

function membersOnlyPage(): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Members Only — The Bakery Ibiza</title>
</head>
<body style="${PAGE_BASE_STYLES}">
  <h1 style="font-weight:600;font-size:22px;margin:0 0 12px;">Members Only</h1>
  <p style="opacity:0.7;margin:0 0 28px;font-size:15px;line-height:1.5;max-width:320px;">Please connect to The Bakery WiFi to access the menu.</p>
  <a href="/unlock" style="color:#C4661F;text-decoration:none;font-size:14px;border:1px solid #C4661F;padding:10px 22px;border-radius:999px;display:inline-block;">I'm a member</a>
</body>
</html>`
  return new Response(html, {
    status: 403,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function unlockPage(error?: string): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Member Access — The Bakery Ibiza</title>
</head>
<body style="${PAGE_BASE_STYLES}">
  <h1 style="font-weight:600;font-size:22px;margin:0 0 10px;">Member Access</h1>
  <p style="opacity:0.6;margin:0 0 28px;font-size:14px;">Enter the 4-digit code from staff at the bar.</p>
  <form method="POST" action="/unlock" style="display:flex;flex-direction:column;gap:14px;align-items:center;">
    <input name="pin" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" autofocus
      style="background:#2a2a2a;border:1px solid #444;color:#fff;font-size:24px;padding:14px 18px;border-radius:12px;width:170px;text-align:center;letter-spacing:8px;outline:none;" />
    <button type="submit" style="background:#C4661F;color:#fff;border:0;padding:12px 32px;border-radius:999px;font-size:15px;cursor:pointer;font-weight:500;">Unlock</button>
  </form>
  ${error ? `<p style="color:#ff6b6b;margin-top:18px;font-size:13px;">${error}</p>` : ''}
  <p style="opacity:0.35;margin-top:36px;font-size:11px;">Stays unlocked for 30 days on this device.</p>
</body>
</html>`
  return new Response(html, {
    status: error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export default async function middleware(request: Request) {
  const url = new URL(request.url)

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  const ipAllowed = ALLOWED_CIDRS.some((cidr) => ipInCidr(ip, cidr))
  const cookieAllowed = hasUnlockCookie(request)

  if (ipAllowed || cookieAllowed) {
    return next()
  }

  // Handle PIN submission
  if (url.pathname === '/unlock' && request.method === 'POST') {
    try {
      const formData = await request.formData()
      const submittedPin = (formData.get('pin')?.toString() ?? '').trim()
      if (submittedPin === MEMBER_PIN) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/',
            'Set-Cookie': `${COOKIE_NAME}=${COOKIE_VALUE}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure; HttpOnly`,
          },
        })
      }
      return unlockPage('Wrong code — please ask staff at the bar.')
    } catch {
      return unlockPage('Something went wrong. Please try again.')
    }
  }

  // Show unlock page on GET /unlock
  if (url.pathname === '/unlock') {
    return unlockPage()
  }

  // Default: blocked
  return membersOnlyPage()
}
