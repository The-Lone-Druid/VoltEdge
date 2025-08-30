import { Metadata } from 'next'
import { AdvancedPricingCalculator } from '@/components/calculators/advanced-pricing-calculator'

export const metadata: Metadata = {
  title: 'Advanced Pricing Calculator | VoltEdge Dashboard',
  description:
    'Calculate pricing, margins, and bulk discounts for B2B and B2C sales',
}

export default function PricingCalculatorPage() {
  return (
    <div className='container mx-auto p-6'>
      <AdvancedPricingCalculator />
    </div>
  )
}
