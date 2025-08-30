import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import {
  trackUserSession,
  cleanupExpiredSessions,
} from '@/lib/session-tracking'

export async function middleware(request: NextRequest) {
  // Get the token to check if user is authenticated
  const token = await getToken({ req: request })

  // Track user sessions for authenticated requests
  if (token?.id) {
    await trackUserSession(request)
  }

  // Cleanup expired sessions periodically (only on dashboard to avoid excessive calls)
  if (request.nextUrl.pathname === '/dashboard') {
    await cleanupExpiredSessions()
  }

  // Redirect logic for protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Allow auth pages for unauthenticated users
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    if (token && !request.nextUrl.pathname.includes('signout')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
