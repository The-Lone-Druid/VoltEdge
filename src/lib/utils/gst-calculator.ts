// GST Calculator Utilities for VoltEdge
// Handles all GST-related calculations for electrical products

export interface GSTRate {
  rate: number
  description: string
  category: string
}

export interface GSTCalculation {
  originalAmount: number
  gstRate: number
  gstAmount: number
  totalAmount: number
  breakdown: {
    baseAmount: number
    cgst: number
    sgst: number
    igst: number
    totalGst: number
  }
  isIntraState: boolean
}

export interface PriceCalculation {
  inclusivePrice: number
  exclusivePrice: number
  gstAmount: number
  gstRate: number
  savings?: number // For discount scenarios
}

/**
 * Calculate GST for a given amount
 * @param amount - Base amount (exclusive of GST)
 * @param gstRate - GST rate percentage (e.g., 18 for 18%)
 * @param isIntraState - Whether transaction is within the same state
 * @returns Complete GST calculation breakdown
 */
export function calculateGST(
  amount: number,
  gstRate: number,
  isIntraState: boolean = true
): GSTCalculation {
  if (amount < 0 || gstRate < 0) {
    throw new Error('Amount and GST rate must be non-negative')
  }

  const gstAmount = (amount * gstRate) / 100
  const totalAmount = amount + gstAmount

  let breakdown
  if (isIntraState) {
    // Intra-state: CGST + SGST (split equally)
    const cgst = gstAmount / 2
    const sgst = gstAmount / 2
    breakdown = {
      baseAmount: amount,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: 0,
      totalGst: gstAmount,
    }
  } else {
    // Inter-state: IGST (full amount)
    breakdown = {
      baseAmount: amount,
      cgst: 0,
      sgst: 0,
      igst: Math.round(gstAmount * 100) / 100,
      totalGst: gstAmount,
    }
  }

  return {
    originalAmount: amount,
    gstRate,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    breakdown,
    isIntraState,
  }
}

/**
 * Calculate price excluding GST from GST-inclusive price
 * @param inclusiveAmount - Amount including GST
 * @param gstRate - GST rate percentage
 * @returns Price calculation with exclusive amount
 */
export function calculateExclusivePrice(
  inclusiveAmount: number,
  gstRate: number
): PriceCalculation {
  if (inclusiveAmount < 0 || gstRate < 0) {
    throw new Error('Amount and GST rate must be non-negative')
  }

  const exclusivePrice = inclusiveAmount / (1 + gstRate / 100)
  const gstAmount = inclusiveAmount - exclusivePrice

  return {
    inclusivePrice: Math.round(inclusiveAmount * 100) / 100,
    exclusivePrice: Math.round(exclusivePrice * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    gstRate,
  }
}

/**
 * Calculate price including GST from GST-exclusive price
 * @param exclusiveAmount - Amount excluding GST
 * @param gstRate - GST rate percentage
 * @returns Price calculation with inclusive amount
 */
export function calculateInclusivePrice(
  exclusiveAmount: number,
  gstRate: number
): PriceCalculation {
  if (exclusiveAmount < 0 || gstRate < 0) {
    throw new Error('Amount and GST rate must be non-negative')
  }

  const gstAmount = (exclusiveAmount * gstRate) / 100
  const inclusivePrice = exclusiveAmount + gstAmount

  return {
    inclusivePrice: Math.round(inclusivePrice * 100) / 100,
    exclusivePrice: Math.round(exclusiveAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    gstRate,
  }
}

/**
 * Calculate discount with GST considerations
 * @param originalPrice - Original price (can be inclusive or exclusive)
 * @param discountPercent - Discount percentage
 * @param gstRate - GST rate percentage
 * @param isPriceInclusive - Whether original price includes GST
 * @returns Complete price calculation with discount
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number,
  gstRate: number,
  isPriceInclusive: boolean = false
) {
  if (originalPrice < 0 || discountPercent < 0 || discountPercent > 100) {
    throw new Error('Invalid price or discount percentage')
  }

  let basePrice: number

  if (isPriceInclusive) {
    // Original price includes GST, extract base price
    basePrice = originalPrice / (1 + gstRate / 100)
  } else {
    // Original price excludes GST
    basePrice = originalPrice
  }

  // Apply discount to base price
  const discountAmount = (basePrice * discountPercent) / 100
  const discountedBasePrice = basePrice - discountAmount

  // Calculate GST on discounted price
  const discountedGstAmount = (discountedBasePrice * gstRate) / 100
  const finalPrice = discountedBasePrice + discountedGstAmount

  const originalGstAmount = (basePrice * gstRate) / 100
  const originalTotalPrice = basePrice + originalGstAmount
  const totalSavings = originalTotalPrice - finalPrice

  return {
    original: {
      basePrice: Math.round(basePrice * 100) / 100,
      gstAmount: Math.round(originalGstAmount * 100) / 100,
      totalPrice: Math.round(originalTotalPrice * 100) / 100,
    },
    discounted: {
      basePrice: Math.round(discountedBasePrice * 100) / 100,
      gstAmount: Math.round(discountedGstAmount * 100) / 100,
      totalPrice: Math.round(finalPrice * 100) / 100,
    },
    discount: {
      percentage: discountPercent,
      baseDiscount: Math.round(discountAmount * 100) / 100,
      totalSavings: Math.round(totalSavings * 100) / 100,
    },
    gstRate,
  }
}

/**
 * Validate GST rate for electrical products
 * @param gstRate - GST rate to validate
 * @returns Whether the rate is valid for electrical products
 */
export function isValidElectricalGSTRate(gstRate: number): boolean {
  const validRates = [0, 5, 12, 18, 28] // Common GST rates in India
  return validRates.includes(gstRate)
}

/**
 * Format currency for Indian market
 * @param amount - Amount to format
 * @param currency - Currency code (default: INR)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR'
): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format number with Indian numbering system (lakhs, crores)
 * @param amount - Amount to format
 * @returns Formatted number string
 */
export function formatIndianNumber(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(amount)
}

// Pricing tier interface for bulk discounts
export interface PricingTier {
  minQty: number
  discountPercent: number
  name: string
}

/**
 * Calculate bulk pricing with tiered discounts
 * @param unitPrice - Price per unit (excluding GST)
 * @param quantity - Number of units
 * @param gstRate - GST rate percentage
 * @param discountTiers - Array of discount tiers with name, minQty, discountPercent
 * @returns Bulk pricing calculation
 */
export function calculateBulkPricing(
  unitPrice: number,
  quantity: number,
  gstRate: number,
  discountTiers: PricingTier[] = []
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
