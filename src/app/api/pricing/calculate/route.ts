import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient()

// Calculate advanced pricing with bulk discounts and margins
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      basePrice,
      costPrice,
      quantity,
      gstRate,
      businessMode,
      productId,
      customerId,
    } = body

    // Validate required fields
    if (!basePrice || !quantity || !gstRate) {
      return NextResponse.json(
        { error: 'Base price, quantity, and GST rate are required' },
        { status: 400 }
      )
    }

    // Define pricing tiers based on business mode
    const b2bTiers = [
      { minQty: 1, discountPercent: 0, name: 'Retail' },
      { minQty: 5, discountPercent: 5, name: 'Small Business' },
      { minQty: 10, discountPercent: 8, name: 'Wholesale' },
      { minQty: 25, discountPercent: 12, name: 'Dealer' },
      { minQty: 50, discountPercent: 15, name: 'Distributor' },
    ]

    const b2cTiers = [
      { minQty: 1, discountPercent: 0, name: 'Single Item' },
      { minQty: 2, discountPercent: 3, name: 'Pair Deal' },
      { minQty: 5, discountPercent: 7, name: 'Family Pack' },
    ]

    const pricingTiers = businessMode === 'B2B' ? b2bTiers : b2cTiers

    // Calculate bulk pricing
    const bulkPricing = calculateBulkPricing(
      basePrice,
      quantity,
      gstRate,
      pricingTiers
    )

    // Calculate margin if cost price is provided
    let marginAnalysis = null
    if (costPrice) {
      const margin = basePrice - costPrice
      const marginPercent = (margin / basePrice) * 100
      const markup = basePrice - costPrice
      const markupPercent = (markup / costPrice) * 100

      marginAnalysis = {
        costPrice,
        sellingPrice: basePrice,
        margin,
        marginPercent,
        markup,
        markupPercent,
        health:
          marginPercent >= 30
            ? 'excellent'
            : marginPercent >= 20
              ? 'good'
              : marginPercent >= 10
                ? 'fair'
                : 'poor',
      }
    }

    // Log pricing activity
    try {
      await prisma.pricingActivity.create({
        data: {
          dealerId: session.user.id,
          productId: productId || null,
          customerId: customerId || null,
          businessMode,
          basePrice,
          costPrice: costPrice || null,
          quantity,
          gstRate,
          finalPrice: bulkPricing.finalTotal,
          discountApplied: bulkPricing.discount.percentage,
          marginPercent: marginAnalysis?.marginPercent || null,
          calculatedAt: new Date(),
        },
      })
    } catch (error) {
      console.error('Failed to log pricing activity:', error)
      // Don't fail the API call if logging fails
    }

    return NextResponse.json({
      success: true,
      data: {
        bulkPricing,
        marginAnalysis,
        businessMode,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Pricing calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate pricing' },
      { status: 500 }
    )
  }
}

// Helper function for bulk pricing calculation
function calculateBulkPricing(
  unitPrice: number,
  quantity: number,
  gstRate: number,
  discountTiers: Array<{
    minQty: number
    discountPercent: number
    name: string
  }>
) {
  // Sort discount tiers by minimum quantity (descending)
  const sortedTiers = discountTiers.sort((a, b) => b.minQty - a.minQty)

  // Find applicable discount tier
  const applicableTier = sortedTiers.find(tier => quantity >= tier.minQty)
  const discountPercent = applicableTier?.discountPercent || 0

  const totalBasePrice = unitPrice * quantity
  const discountAmount = (totalBasePrice * discountPercent) / 100
  const discountedBasePrice = totalBasePrice - discountAmount

  const gstAmount = (discountedBasePrice * gstRate) / 100
  const finalTotal = discountedBasePrice + gstAmount

  return {
    unitPrice: Math.round(unitPrice * 100) / 100,
    quantity,
    originalTotal: Math.round(totalBasePrice * 100) / 100,
    discount: {
      percentage: discountPercent,
      amount: Math.round(discountAmount * 100) / 100,
      tier: applicableTier || null,
    },
    subtotal: Math.round(discountedBasePrice * 100) / 100,
    gst: {
      rate: gstRate,
      amount: Math.round(gstAmount * 100) / 100,
    },
    finalTotal: Math.round(finalTotal * 100) / 100,
    savings: Math.round(discountAmount * 100) / 100,
  }
}

// Get pricing history and analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const businessMode = searchParams.get('businessMode') as
      | 'B2B'
      | 'B2C'
      | null

    // Get recent pricing activities
    const activities = await prisma.pricingActivity.findMany({
      where: {
        dealerId: session.user.id,
        ...(businessMode && { businessMode }),
      },
      orderBy: {
        calculatedAt: 'desc',
      },
      take: limit,
      include: {
        product: {
          select: {
            name: true,
            category: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
      },
    })

    // Calculate analytics
    const analytics = await prisma.pricingActivity.aggregate({
      where: {
        dealerId: session.user.id,
        ...(businessMode && { businessMode }),
        calculatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      _avg: {
        marginPercent: true,
        discountApplied: true,
        finalPrice: true,
      },
      _count: {
        id: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        activities,
        analytics: {
          averageMargin: analytics._avg.marginPercent || 0,
          averageDiscount: analytics._avg.discountApplied || 0,
          averageOrderValue: analytics._avg.finalPrice || 0,
          totalCalculations: analytics._count.id,
        },
      },
    })
  } catch (error) {
    console.error('Failed to fetch pricing data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    )
  }
}
