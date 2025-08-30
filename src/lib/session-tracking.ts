import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { getToken } from 'next-auth/jwt'

export async function trackUserSession(request: NextRequest) {
  try {
    const token = await getToken({ req: request })

    if (!token?.id) return

    const sessionToken =
      request.cookies.get('next-auth.session-token')?.value ||
      request.cookies.get('__Secure-next-auth.session-token')?.value

    if (!sessionToken) return

    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'Unknown'

    // Parse device info from user agent
    const deviceInfo = parseDeviceInfo(userAgent)

    // Check if session already exists
    const existingSession = await prisma.userSession.findFirst({
      where: {
        sessionToken,
        isActive: true,
      },
    })

    if (!existingSession) {
      // Create new session record
      await prisma.userSession.create({
        data: {
          userId: token.id,
          sessionToken,
          userAgent,
          ipAddress,
          deviceInfo,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          isActive: true,
        },
      })
    } else {
      // Update existing session with latest activity
      await prisma.userSession.update({
        where: { id: existingSession.id },
        data: {
          userAgent,
          ipAddress,
          deviceInfo,
          updatedAt: new Date(),
        },
      })
    }
  } catch (error) {
    console.error('Failed to track user session:', error)
    // Don't throw error to avoid breaking the app
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

export async function cleanupExpiredSessions() {
  try {
    await prisma.userSession.updateMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    })
  } catch (error) {
    console.error('Failed to cleanup expired sessions:', error)
  }
}
