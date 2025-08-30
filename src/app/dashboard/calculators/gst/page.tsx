import { GSTCalculator } from '@/components/calculators/gst-calculator'
import { Metadata } from 'next'
import { PageHeader } from '../../../../components/dashboard/page-header'

export const metadata: Metadata = {
  title: 'GST Calculator | VoltEdge',
  description:
    'Calculate GST for electrical products with support for CGST, SGST, and IGST',
}

export default function GSTCalculatorPage() {
  return (
    <div className='container mx-auto space-y-6'>
      <PageHeader
        title={'GST Calculator'}
        subtitle={
          'Calculate GST for your electrical products with real-time rates from your catalog.'
        }
      />
      <GSTCalculator />
    </div>
  )
}
