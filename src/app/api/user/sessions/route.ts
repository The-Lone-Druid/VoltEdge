import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserActiveSessions } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get the current session identifier from the request headers
    const currentSessionId = request.headers.get('x-session-identifier')

    const activeSessions = await getUserActiveSessions(session.user.id)

    // Transform sessions for the frontend
    const sessionsWithDetails = activeSessions.map(userSession => ({
      id: userSession.id,
      sessionToken: userSession.sessionToken.slice(-8), // Show only last 8 chars for security
      userAgent: userSession.userAgent,
      ipAddress: userSession.ipAddress,
      deviceInfo: userSession.deviceInfo,
      isActive: userSession.isActive,
      createdAt: userSession.createdAt,
      expiresAt: userSession.expiresAt,
      isCurrent: userSession.sessionToken === currentSessionId,
    }))

    return NextResponse.json({ sessions: sessionsWithDetails })
  } catch (error) {
    console.error('Failed to fetch user sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
