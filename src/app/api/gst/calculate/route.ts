import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      amount,
      gstRate,
      category,
      isInclusive,
      isIntraState,
      calculationResult,
    } = body

    // Validate required fields
    if (!amount || !gstRate || !category || !calculationResult) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'GST_CALCULATION',
        details: {
          amount: parseFloat(amount),
          gstRate: parseFloat(gstRate),
          category,
          isInclusive,
          isIntraState,
          result: calculationResult,
          timestamp: new Date().toISOString(),
        },
        ipAddress:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'GST calculation logged successfully',
    })
  } catch (error) {
    console.error('Error logging GST calculation:', error)
    return NextResponse.json(
      { error: 'Failed to log calculation' },
      { status: 500 }
    )
  }
}
