import { AdvancedPricingCalculator } from '@/components/calculators/advanced-pricing-calculator'
import { Metadata } from 'next'
import { PageHeader } from '../../../../components/dashboard/page-header'

export const metadata: Metadata = {
  title: 'Advanced Pricing Calculator | VoltEdge Dashboard',
  description:
    'Calculate pricing, margins, and bulk discounts for B2B and B2C sales',
}

export default function PricingCalculatorPage() {
  return (
    <div className='container mx-auto space-y-6'>
      <PageHeader
        title={'Advanced GST Calculator'}
        subtitle={
          'Calculate GST for your electrical products with real-time rates from your catalog.'
        }
      />
      <AdvancedPricingCalculator />
    </div>
  )
}
