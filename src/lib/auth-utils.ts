import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { sendInvitationEmail, sendPasswordResetEmail } from '@/lib/auth'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }
  return session
}

export async function requireRole(allowedRoles: Array<'MASTER' | 'DEALER'>) {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/unauthorized')
  }
  return session
}

export async function requireMaster() {
  return await requireRole(['MASTER'])
}

export async function requireActiveUser() {
  const session = await requireAuth()
  if (session.user.status !== 'ACTIVE') {
    redirect('/account/inactive')
  }
  return session
}

// User management functions for master users
export async function inviteUser(
  email: string,
  role: 'DEALER',
  invitedByUserId: string
) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' }
    }

    // Generate invitation token
    const invitationToken = uuidv4()
    const invitationExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create user with pending invitation status
    const newUser = await prisma.user.create({
      data: {
        email,
        role,
        status: 'PENDING_INVITATION',
        invitedBy: invitedByUserId,
        invitationToken,
        invitationExpiresAt,
      },
    })

    // Get inviter details for email
    const inviter = await prisma.user.findUnique({
      where: { id: invitedByUserId },
      select: { firstName: true, lastName: true, email: true },
    })

    const inviterName = inviter
      ? `${inviter.firstName || ''} ${inviter.lastName || ''}`.trim() ||
        inviter.email
      : 'VoltEdge Admin'

    // Send invitation email
    const emailResult = await sendInvitationEmail(
      email,
      inviterName,
      invitationToken
    )

    if (!emailResult.success) {
      // Rollback user creation if email fails
      await prisma.user.delete({ where: { id: newUser.id } })
      return { success: false, error: 'Failed to send invitation email' }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: invitedByUserId,
        action: 'ADMIN_ACTION',
        details: {
          action: 'invite_user',
          invitedEmail: email,
          invitedRole: role,
        },
      },
    })

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    }
  } catch (error) {
    console.error('Failed to invite user:', error)
    return { success: false, error: 'Failed to create invitation' }
  }
}

export async function setupUserAccount(
  token: string,
  userData: {
    firstName: string
    lastName: string
    password: string
  }
) {
  try {
    // Find user by invitation token
    const user = await prisma.user.findFirst({
      where: {
        invitationToken: token,
        status: 'PENDING_INVITATION',
        invitationExpiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return { success: false, error: 'Invalid or expired invitation token' }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12)

    // Update user with account details
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash,
        status: 'ACTIVE',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        invitationToken: null,
        invitationExpiresAt: null,
      },
    })

    // Create dealer profile if user is a dealer
    if (updatedUser.role === 'DEALER') {
      await prisma.dealerProfile.create({
        data: {
          userId: updatedUser.id,
          businessName: `${userData.firstName} ${userData.lastName}'s Business`,
          // Other default values will be set by the schema defaults
        },
      })
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: updatedUser.id,
        action: 'UPDATE_PROFILE',
        details: {
          action: 'account_setup_completed',
        },
      },
    })

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Failed to setup user account:', error)
    return { success: false, error: 'Failed to setup account' }
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || user.status !== 'ACTIVE') {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message:
          'If an account exists, password reset instructions have been sent',
      }
    }

    // Generate reset token
    const resetToken = uuidv4()
    const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiresAt: resetExpiresAt,
      },
    })

    // Send reset email
    const userName = user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user.email
    await sendPasswordResetEmail(email, resetToken, userName)

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE_PROFILE',
        details: {
          action: 'password_reset_requested',
        },
      },
    })

    return {
      success: true,
      message: 'Password reset instructions have been sent to your email',
    }
  } catch (error) {
    console.error('Failed to request password reset:', error)
    return { success: false, error: 'Failed to process password reset request' }
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return { success: false, error: 'Invalid or expired reset token' }
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      },
    })

    // Invalidate all user sessions for security
    await prisma.userSession.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE_PROFILE',
        details: {
          action: 'password_reset_completed',
        },
      },
    })

    return { success: true, message: 'Password has been reset successfully' }
  } catch (error) {
    console.error('Failed to reset password:', error)
    return { success: false, error: 'Failed to reset password' }
  }
}

// Session management functions
export async function getUserActiveSessions(userId: string) {
  return await prisma.userSession.findMany({
    where: {
      userId,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function revokeUserSession(sessionId: string, userId: string) {
  try {
    await prisma.userSession.updateMany({
      where: {
        id: sessionId,
        userId, // Ensure user can only revoke their own sessions
      },
      data: {
        isActive: false,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to revoke session:', error)
    return { success: false, error: 'Failed to revoke session' }
  }
}

export async function revokeAllUserSessions(userId: string) {
  try {
    await prisma.userSession.updateMany({
      where: { userId },
      data: { isActive: false },
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to revoke all sessions:', error)
    return { success: false, error: 'Failed to revoke sessions' }
  }
}

// User management for master users
export async function getUsersList(page = 1, limit = 10, search?: string) {
  const skip = (page - 1) * limit

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: {
        dealerProfile: {
          select: {
            businessName: true,
            landingPageSlug: true,
          },
        },
        _count: {
          select: {
            quotations: true,
            activityLogs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.user.count({ where }),
  ])

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export async function updateUserStatus(
  userId: string,
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
  updatedBy: string
) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status },
    })

    // Log the action
    await prisma.activityLog.create({
      data: {
        userId: updatedBy,
        action: 'ADMIN_ACTION',
        details: {
          action: 'update_user_status',
          targetUserId: userId,
          newStatus: status,
        },
      },
    })

    // If user is being deactivated/suspended, revoke their sessions
    if (status !== 'ACTIVE') {
      await revokeAllUserSessions(userId)
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to update user status:', error)
    return { success: false, error: 'Failed to update user status' }
  }
}

// Email verification functions
export async function sendVerificationEmail(email: string, token: string) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

    const subject = 'Verify your VoltEdge account email'
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Thank you for signing up with VoltEdge! Please click the button below to verify your email address:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>

        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>

        <p>This link will expire in 24 hours for security reasons.</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          If you didn't create a VoltEdge account, please ignore this email.
        </p>
      </div>
    `

    if (process.env.EMAIL_SERVICE === 'console') {
      console.log(`
        === EMAIL VERIFICATION ===
        To: ${email}
        Subject: ${subject}
        Verification URL: ${verificationUrl}
        =========================
      `)
      return { success: true }
    }

    // If using Resend or other email service
    // Implementation would go here similar to other email functions

    return { success: true }
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return { success: false, error: 'Failed to send verification email' }
  }
}

export async function generateEmailVerificationToken(userId: string) {
  try {
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours expiry

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: token,
        emailVerificationExpiresAt: expiresAt,
      },
    })

    return { success: true, token }
  } catch (error) {
    console.error('Failed to generate verification token:', error)
    return { success: false, error: 'Failed to generate verification token' }
  }
}

export async function verifyUserEmail(token: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return { success: false, error: 'Invalid or expired verification token' }
    }

    if (user.emailVerified) {
      return { success: true, message: 'Email is already verified' }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE_PROFILE',
        details: {
          action: 'email_verified',
        },
      },
    })

    return { success: true, message: 'Email verified successfully' }
  } catch (error) {
    console.error('Failed to verify email:', error)
    return { success: false, error: 'Failed to verify email' }
  }
}
