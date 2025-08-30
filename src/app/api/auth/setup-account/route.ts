import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, firstName, lastName, password } = await request.json()

    if (!token || !firstName || !lastName || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Find the user with this invitation token
    const user = await prisma.user.findFirst({
      where: {
        invitationToken: token,
        invitationExpiresAt: {
          gt: new Date(),
        },
        status: 'PENDING_INVITATION',
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation token' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update the user's account
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
          passwordHash: hashedPassword,
          status: 'ACTIVE',
          emailVerified: true,
          emailVerifiedAt: new Date(),
          invitationToken: null,
          invitationExpiresAt: null,
        },
      }),
      prisma.activityLog.create({
        data: {
          userId: user.id,
          action: 'UPDATE_PROFILE',
          details: {
            action: 'account_setup_completed',
            firstName,
            lastName,
          },
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Account setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup account' },
      { status: 500 }
    )
  }
}
