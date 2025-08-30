import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import crypto from 'crypto'

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['DEALER', 'MASTER']),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'MASTER') {
      return NextResponse.json(
        { message: 'Access denied. Master role required.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = inviteSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'A user with this email already exists' },
        { status: 400 }
      )
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex')
    const invitationExpires = new Date()
    invitationExpires.setHours(invitationExpires.getHours() + 24) // 24 hours

    // Create pending user
    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
        status: 'PENDING_INVITATION',
        emailVerified: false,
        invitationToken,
        invitationExpiresAt: invitationExpires,
        invitedBy: session.user.id,
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'ADMIN_ACTION',
        details: {
          action: 'user_invited',
          targetUser: validatedData.email,
          role: validatedData.role,
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
        validatedData.email,
        session.user.firstName || session.user.email || 'Admin',
        invitationToken
      )
    } catch (emailError) {
      console.log('Email sending failed, but invitation created:', emailError)
      // Don't fail the entire operation if email fails
    }
    return NextResponse.json({
      message: 'Invitation sent successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      // Only include verification URL in development
      ...(process.env.NODE_ENV === 'development' && { verificationUrl }),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.issues },
        { status: 400 }
      )
    }

    console.error('Failed to send invitation:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
