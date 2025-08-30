import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: 'MASTER' | 'DEALER'
      status: 'ACTIVE' | 'INACTIVE' | 'PENDING_INVITATION' | 'SUSPENDED'
      firstName?: string | null
      lastName?: string | null
      emailVerified: boolean
      dealerProfile?: {
        id: string
        businessName: string
        landingPageSlug?: string | null
      } | null
    }
  }

  interface User {
    id: string
    email: string
    role: 'MASTER' | 'DEALER'
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING_INVITATION' | 'SUSPENDED'
    firstName?: string | null
    lastName?: string | null
    emailVerified: boolean
    dealerProfile?: {
      id: string
      businessName: string
      landingPageSlug?: string | null
    } | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'MASTER' | 'DEALER'
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING_INVITATION' | 'SUSPENDED'
    emailVerified: boolean
    dealerProfile?: {
      id: string
      businessName: string
      landingPageSlug?: string | null
    } | null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            dealerProfile: {
              select: {
                id: true,
                businessName: true,
                landingPageSlug: true,
              },
            },
          },
        })

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials')
        }

        if (user.status !== 'ACTIVE') {
          throw new Error(
            'Account is not active. Please contact administrator.'
          )
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        // Log the login activity
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: 'LOGIN',
            details: {
              loginMethod: 'credentials',
              timestamp: new Date().toISOString(),
            },
          },
        })

        // Update last login time
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerifiedAt !== null,
          dealerProfile: user.dealerProfile,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.status = user.status
        token.emailVerified = Boolean(user.emailVerified)
        token.dealerProfile = user.dealerProfile
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        return { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.status = token.status
        session.user.emailVerified = token.emailVerified
        session.user.dealerProfile = token.dealerProfile
      }
      return session
    },
    async signIn({ account }) {
      if (account?.provider === 'credentials') {
        // The session token tracking will be handled by middleware
        // since we need access to request headers there
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  events: {
    // Additional cleanup events if needed
  },
}

// Utility functions for authentication
export async function sendInvitationEmail(
  email: string,
  inviterName: string,
  invitationToken: string
) {
  const invitationUrl = `${process.env.NEXTAUTH_URL}/auth/setup-account?token=${invitationToken}`

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'VoltEdge <noreply@voltedge.com>',
      to: email,
      subject: 'Welcome to VoltEdge - Complete Your Account Setup',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to VoltEdge!</h2>
          <p>Hello,</p>
          <p>You've been invited by <strong>${inviterName}</strong> to join VoltEdge, the electrical dealer management platform.</p>
          <p>To complete your account setup, please click the link below:</p>
          <a href="${invitationUrl}"
             style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Complete Account Setup
          </a>
          <p>This invitation link will expire in 7 days.</p>
          <p>If you didn't expect this invitation, please ignore this email.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            VoltEdge - Electrical Dealer Management Platform<br>
            This is an automated email, please do not reply.
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send invitation email:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'VoltEdge <noreply@voltedge.com>',
      to: email,
      subject: 'Reset Your VoltEdge Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>We received a request to reset your VoltEdge account password.</p>
          <p>To reset your password, please click the link below:</p>
          <a href="${resetUrl}"
             style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p>This reset link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            VoltEdge - Electrical Dealer Management Platform<br>
            This is an automated email, please do not reply.
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return { success: false, error: (error as Error).message }
  }
}
