import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

interface CategoryGSTInfo {
  category: string
  rate: number
  description: string
  productCount: number
  hsnCode?: string
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get active GST rates from the database
    const activeGstRates = await prisma.gstRate.findMany({
      where: {
        isActive: true,
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: new Date() } }],
      },
      orderBy: {
        rate: 'asc',
      },
    })

    // Get product categories with their counts for the dealer
    const categoriesWithCounts = await prisma.product.groupBy({
      by: ['category'],
      where: {
        dealerId: session.user.id,
        isActive: true,
      },
      _count: {
        id: true,
      },
    })

    // Build response with GST information from database
    const gstRates: CategoryGSTInfo[] = activeGstRates.map(gstRate => {
      const categoryData = categoriesWithCounts.find(
        c => c.category === gstRate.category
      )

      return {
        category: gstRate.category,
        rate: Number(gstRate.rate),
        description:
          gstRate.description || getCategoryDescription(gstRate.category),
        productCount: categoryData?._count.id || 0,
        hsnCode: gstRate.hsnCode || undefined,
      }
    })

    // Also get custom GST rates from products (in case dealer has custom rates)
    const customRates = await prisma.product.findMany({
      where: {
        dealerId: session.user.id,
        isActive: true,
        gstRate: {
          not: undefined,
        },
      },
      select: {
        category: true,
        gstRate: true,
      },
      distinct: ['category', 'gstRate'],
    })

    // Add custom rates to the response if they're different from standard rates
    customRates.forEach(product => {
      const gstRate = Number(product.gstRate)
      const standardRate = activeGstRates.find(
        r => r.category === product.category
      )

      // Only add if it's different from standard rate
      if (!standardRate || gstRate !== Number(standardRate.rate)) {
        const existingCustom = gstRates.find(
          r => r.category === product.category && r.rate === gstRate
        )

        if (!existingCustom) {
          gstRates.push({
            category: product.category,
            rate: gstRate,
            description: `${getCategoryDescription(product.category)} (Custom Rate)`,
            productCount: 0, // We'll calculate this separately if needed
          })
        }
      }
    })

    return NextResponse.json({
      success: true,
      gstRates: gstRates.sort((a, b) => a.rate - b.rate),
    })
  } catch (error) {
    console.error('Error fetching GST rates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GST rates' },
      { status: 500 }
    )
  }
}

function getCategoryDescription(category: string): string {
  const descriptions = {
    BATTERY: 'Batteries and Energy Storage',
    INVERTER: 'Inverters and Power Electronics',
    SOLAR_PANEL: 'Solar Panels and Renewable Energy',
    ACCESSORIES: 'Electrical Accessories',
    OTHER: 'Other Electrical Products',
  }

  return (
    descriptions[category as keyof typeof descriptions] || 'Electrical Product'
  )
}
