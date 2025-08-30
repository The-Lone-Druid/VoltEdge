import { authOptions } from '@/lib/auth'
import { revokeUserSession } from '@/lib/auth-utils'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const result = await revokeUserSession(id, session.user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to revoke session' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Session revoked successfully' })
  } catch (error) {
    console.error('Failed to revoke session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
