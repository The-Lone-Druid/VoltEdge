import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'MASTER') {
      return NextResponse.json(
        { message: 'Access denied. Master role required.' },
        { status: 403 }
      )
    }

    const { id: userId } = await params

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (user.status !== 'PENDING_INVITATION') {
      return NextResponse.json(
        { message: 'Can only resend invitations to pending users' },
        { status: 400 }
      )
    }

    // Generate new verification token
    const invitationToken = crypto.randomBytes(32).toString('hex')
    const invitationExpires = new Date()
    invitationExpires.setHours(invitationExpires.getHours() + 24) // 24 hours

    // Update user with new token
    await prisma.user.update({
      where: { id: userId },
      data: {
        invitationToken,
        invitationExpiresAt: invitationExpires,
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'ADMIN_ACTION',
        details: {
          action: 'resend_invitation',
          targetUser: user.email,
        },
        ipAddress:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // Send invitation email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/setup-account?token=${invitationToken}`

    try {
      // Import and send email
      const { sendInvitationEmail } = await import('@/lib/auth')
      await sendInvitationEmail(
        user.email,
        session.user.firstName || session.user.email || 'Admin',
        invitationToken
      )
    } catch (emailError) {
      console.log('Email sending failed, but invitation updated:', emailError)
      // Don't fail the entire operation if email fails
    }

    return NextResponse.json({
      message: 'Invitation resent successfully',
      // Only include verification URL in development
      ...(process.env.NODE_ENV === 'development' && { verificationUrl }),
    })
  } catch (error) {
    console.error('Failed to resend invitation:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
