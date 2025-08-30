import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'MASTER') {
      return NextResponse.json(
        { message: 'Access denied. Master role required.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const activities = await prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // Transform the activities to include description from details
    const transformedActivities = activities.map(activity => ({
      id: activity.id,
      userId: activity.userId,
      action: activity.action,
      description: getActivityDescription(activity),
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      createdAt: activity.createdAt,
      user: activity.user,
    }))

    return NextResponse.json({ activities: transformedActivities })
  } catch (error) {
    console.error('Failed to fetch activities:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getActivityDescription(activity: {
  action: string
  details: unknown
}): string {
  if (activity.details && typeof activity.details === 'object') {
    const details = activity.details as Record<string, string>

    switch (details.action) {
      case 'user_invited':
        return `Invited ${details.targetUser} as ${details.role}`
      case 'resend_invitation':
        return `Resent invitation to ${details.targetUser}`
      case 'user_activate':
        return `Activated user ${details.targetUser}`
      case 'user_deactivate':
        return `Deactivated user ${details.targetUser}`
      default:
        return details.description || `Performed ${activity.action}`
    }
  }

  // Fallback for activities without details
  switch (activity.action) {
    case 'LOGIN':
      return 'User logged in'
    case 'LOGOUT':
      return 'User logged out'
    case 'UPDATE_PROFILE':
      return 'Updated profile'
    case 'ADMIN_ACTION':
      return 'Performed admin action'
    default:
      return `Performed ${activity.action}`
  }
}
