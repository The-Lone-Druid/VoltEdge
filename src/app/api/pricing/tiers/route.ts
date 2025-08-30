import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Default pricing tiers for different business modes
const DEFAULT_B2B_TIERS = [
  {
    minQty: 1,
    discountPercent: 0,
    name: 'Retail',
    description: 'Single item purchase',
  },
  {
    minQty: 5,
    discountPercent: 5,
    name: 'Small Business',
    description: '5+ items bulk order',
  },
  {
    minQty: 10,
    discountPercent: 8,
    name: 'Wholesale',
    description: '10+ items wholesale',
  },
  {
    minQty: 25,
    discountPercent: 12,
    name: 'Dealer',
    description: '25+ items dealer rate',
  },
  {
    minQty: 50,
    discountPercent: 15,
    name: 'Distributor',
    description: '50+ items distributor rate',
  },
  {
    minQty: 100,
    discountPercent: 20,
    name: 'Bulk Partner',
    description: '100+ items partnership rate',
  },
]

const DEFAULT_B2C_TIERS = [
  {
    minQty: 1,
    discountPercent: 0,
    name: 'Single Item',
    description: 'Individual purchase',
  },
  {
    minQty: 2,
    discountPercent: 3,
    name: 'Pair Deal',
    description: 'Buy 2 items',
  },
  {
    minQty: 5,
    discountPercent: 7,
    name: 'Family Pack',
    description: 'Family bundle deal',
  },
  {
    minQty: 10,
    discountPercent: 12,
    name: 'Bulk Consumer',
    description: 'Consumer bulk purchase',
  },
]

// Get pricing tiers for a business mode
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const businessMode = searchParams.get('mode') as 'B2B' | 'B2C' | null

    let tiers
    switch (businessMode) {
      case 'B2B':
        tiers = DEFAULT_B2B_TIERS
        break
      case 'B2C':
        tiers = DEFAULT_B2C_TIERS
        break
      default:
        // Return both if no mode specified
        tiers = {
          B2B: DEFAULT_B2B_TIERS,
          B2C: DEFAULT_B2C_TIERS,
        }
    }

    return NextResponse.json({
      success: true,
      data: {
        tiers,
        businessMode,
        defaultMode: businessMode || 'both',
      },
    })
  } catch (error) {
    console.error('Failed to fetch pricing tiers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing tiers' },
      { status: 500 }
    )
  }
}

// Calculate preview pricing for different tiers
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { basePrice, gstRate, businessMode, maxQuantity = 100 } = body

    if (!basePrice || !gstRate || !businessMode) {
      return NextResponse.json(
        { error: 'Base price, GST rate, and business mode are required' },
        { status: 400 }
      )
    }

    const tiers = businessMode === 'B2B' ? DEFAULT_B2B_TIERS : DEFAULT_B2C_TIERS

    // Calculate pricing for different quantities
    const pricingExamples = []
    const quantities = [1, 5, 10, 25, 50, 100].filter(q => q <= maxQuantity)

    for (const qty of quantities) {
      // Find applicable tier
      const applicableTier = tiers
        .sort((a, b) => b.minQty - a.minQty)
        .find(tier => qty >= tier.minQty)

      if (applicableTier) {
        const totalBasePrice = basePrice * qty
        const discountAmount =
          (totalBasePrice * applicableTier.discountPercent) / 100
        const discountedPrice = totalBasePrice - discountAmount
        const gstAmount = (discountedPrice * gstRate) / 100
        const finalTotal = discountedPrice + gstAmount

        pricingExamples.push({
          quantity: qty,
          unitPrice: basePrice,
          totalBasePrice: Math.round(totalBasePrice * 100) / 100,
          tier: applicableTier,
          discount: {
            percentage: applicableTier.discountPercent,
            amount: Math.round(discountAmount * 100) / 100,
          },
          subtotal: Math.round(discountedPrice * 100) / 100,
          gst: {
            rate: gstRate,
            amount: Math.round(gstAmount * 100) / 100,
          },
          finalTotal: Math.round(finalTotal * 100) / 100,
          pricePerUnit: Math.round((finalTotal / qty) * 100) / 100,
          savings: Math.round(discountAmount * 100) / 100,
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        basePrice,
        gstRate,
        businessMode,
        pricingExamples,
        tierStructure: tiers,
      },
    })
  } catch (error) {
    console.error('Failed to calculate tier pricing:', error)
    return NextResponse.json(
      { error: 'Failed to calculate tier pricing' },
      { status: 500 }
    )
  }
}
