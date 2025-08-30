import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { userAgent, ipAddress, sessionIdentifier } = await request.json()

    // Parse device info from user agent
    const deviceInfo = parseDeviceInfo(userAgent || 'Unknown')

    // Check if a session already exists for this identifier
    const existingSession = await prisma.userSession.findFirst({
      where: {
        userId: session.user.id,
        sessionToken: sessionIdentifier,
        isActive: true,
      },
    })

    if (!existingSession) {
      // Create new session record
      const newSession = await prisma.userSession.create({
        data: {
          userId: session.user.id,
          sessionToken: sessionIdentifier,
          userAgent: userAgent || null,
          ipAddress: ipAddress || null,
          deviceInfo,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          isActive: true,
        },
      })

      return NextResponse.json({
        success: true,
        sessionId: newSession.id,
        sessionIdentifier,
      })
    } else {
      // Update existing session
      await prisma.userSession.update({
        where: { id: existingSession.id },
        data: {
          updatedAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Extend expiry
        },
      })

      return NextResponse.json({
        success: true,
        sessionId: existingSession.id,
        sessionIdentifier,
      })
    }
  } catch (error) {
    console.error('Failed to track session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function parseDeviceInfo(userAgent: string): string {
  try {
    // Simple device detection - can be enhanced with a proper library
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent)
    const isTablet = /iPad|Tablet/i.test(userAgent)

    let browser = 'Unknown'
    let os = 'Unknown'

    // Browser detection
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Edge')) browser = 'Edge'

    // OS detection
    if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Mac')) os = 'macOS'
    else if (userAgent.includes('Linux')) os = 'Linux'
    else if (userAgent.includes('Android')) os = 'Android'
    else if (userAgent.includes('iOS')) os = 'iOS'

    let deviceType = 'Desktop'
    if (isTablet) deviceType = 'Tablet'
    else if (isMobile) deviceType = 'Mobile'

    return `${deviceType} - ${browser} on ${os}`
  } catch {
    return 'Unknown Device'
  }
}
