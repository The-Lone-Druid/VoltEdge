import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revokeAllUserSessions } from '@/lib/auth-utils'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const result = await revokeAllUserSessions(session.user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to revoke all sessions' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message:
        'All sessions revoked successfully. You will be logged out shortly.',
    })
  } catch (error) {
    console.error('Failed to revoke all sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
