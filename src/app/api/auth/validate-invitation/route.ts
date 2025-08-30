import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
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
      include: {
        dealerProfile: {
          select: {
            businessName: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      invitation: {
        email: user.email,
        dealerName: user.dealerProfile?.businessName,
      },
    })
  } catch (error) {
    console.error('Invitation validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate invitation' },
      { status: 500 }
    )
  }
}
