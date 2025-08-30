import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'MASTER') {
      return NextResponse.json(
        { message: 'Access denied. Master role required.' },
        { status: 403 }
      )
    }

    const { action } = await request.json()
    const { id: userId } = await params

    if (!action || !['activate', 'deactivate'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid action. Use "activate" or "deactivate".' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Prevent deactivating the last Master user
    if (action === 'deactivate' && user.role === 'MASTER') {
      const activeMasterCount = await prisma.user.count({
        where: {
          role: 'MASTER',
          status: 'ACTIVE',
        },
      })

      if (activeMasterCount <= 1) {
        return NextResponse.json(
          { message: 'Cannot deactivate the last Master user' },
          { status: 400 }
        )
      }
    }

    // Update user status
    const newStatus = action === 'activate' ? 'ACTIVE' : 'INACTIVE'
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'ADMIN_ACTION',
        details: {
          action: `user_${action}`,
          targetUser: user.email,
        },
        ipAddress:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      message: `User ${action}d successfully`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        status: updatedUser.status,
      },
    })
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'MASTER') {
      return NextResponse.json(
        { message: 'Access denied. Master role required.' },
        { status: 403 }
      )
    }

    const { id: userId } = await params

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Only allow deleting pending invitations
    if (user.status !== 'PENDING_INVITATION') {
      return NextResponse.json(
        { message: 'Can only cancel pending invitations' },
        { status: 400 }
      )
    }

    // Prevent deleting the last Master user
    if (user.role === 'MASTER') {
      const activeMasterCount = await prisma.user.count({
        where: {
          role: 'MASTER',
          status: 'ACTIVE',
        },
      })

      if (activeMasterCount <= 1) {
        return NextResponse.json(
          { message: 'Cannot delete the last Master user' },
          { status: 400 }
        )
      }
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'ADMIN_ACTION',
        details: {
          action: 'user_invitation_cancelled',
          targetUser: user.email,
        },
        ipAddress:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      message: 'Invitation cancelled successfully',
    })
  } catch (error) {
    console.error('Failed to cancel invitation:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
