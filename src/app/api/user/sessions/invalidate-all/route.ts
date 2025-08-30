import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Mark all user sessions as inactive
    await prisma.userSession.updateMany({
      where: { userId: session.user.id },
      data: { isActive: false },
    })

    // Create a session invalidation record
    // This will be used to check if tokens are still valid
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        // Add a field to track when sessions were last invalidated
        updatedAt: new Date(),
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'LOGOUT',
        details: {
          action: 'logout_all_sessions',
          timestamp: new Date().toISOString(),
        },
      },
    })

    return NextResponse.json({
      message:
        'All sessions revoked successfully. Please refresh all browser tabs to complete logout.',
    })
  } catch (error) {
    console.error('Failed to revoke all sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
