'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  Calculator,
  TrendingUp,
  Users,
  Package,
  Percent,
  DollarSign,
  BarChart3,
  RefreshCw,
} from 'lucide-react'
import {
  calculateBulkPricing,
  formatCurrency,
  PricingTier,
} from '@/lib/utils/gst-calculator'

interface MarginCalculation {
  costPrice: number
  sellingPrice: number
  margin: number
  marginPercent: number
  markup: number
  markupPercent: number
}

interface BulkPricingResult {
  unitPrice: number
  quantity: number
  originalTotal: number
  discount: {
    percentage: number
    amount: number
    tier: PricingTier | null
  }
  subtotal: number
  gst: {
    rate: number
    amount: number
  }
  finalTotal: number
  savings: number
}

const DEFAULT_B2B_TIERS: PricingTier[] = [
  { minQty: 1, discountPercent: 0, name: 'Retail' },
  { minQty: 5, discountPercent: 5, name: 'Small Business' },
  { minQty: 10, discountPercent: 8, name: 'Wholesale' },
  { minQty: 25, discountPercent: 12, name: 'Dealer' },
  { minQty: 50, discountPercent: 15, name: 'Distributor' },
]

const DEFAULT_B2C_TIERS: PricingTier[] = [
  { minQty: 1, discountPercent: 0, name: 'Single Item' },
  { minQty: 2, discountPercent: 3, name: 'Pair Deal' },
  { minQty: 5, discountPercent: 7, name: 'Family Pack' },
]

export function AdvancedPricingCalculator() {
  // Mode & Configuration
  const [businessMode, setBusinessMode] = useState<'B2B' | 'B2C'>('B2B')
  const [pricingTiers, setPricingTiers] =
    useState<PricingTier[]>(DEFAULT_B2B_TIERS)

  // Basic Inputs
  const [basePrice, setBasePrice] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('1')
  const [gstRate, setGSTRate] = useState<number>(18)
  const [costPrice, setCostPrice] = useState<string>('')

  // Calculation Results
  const [bulkResult, setBulkResult] = useState<BulkPricingResult | null>(null)
  const [marginResult, setMarginResult] = useState<MarginCalculation | null>(
    null
  )

  // Switch pricing tiers when mode changes
  useEffect(() => {
    setPricingTiers(
      businessMode === 'B2B' ? DEFAULT_B2B_TIERS : DEFAULT_B2C_TIERS
    )
  }, [businessMode])

  // Calculate bulk pricing
  const calculateBulk = useCallback(() => {
    const price = parseFloat(basePrice)
    const qty = parseInt(quantity)

    if (
      !basePrice ||
      !quantity ||
      isNaN(price) ||
      isNaN(qty) ||
      price <= 0 ||
      qty <= 0
    ) {
      setBulkResult(null)
      return
    }

    const result = calculateBulkPricing(price, qty, gstRate, pricingTiers)
    setBulkResult(result)
  }, [basePrice, quantity, gstRate, pricingTiers])

  // Calculate margin
  const calculateMargin = useCallback(() => {
    const cost = parseFloat(costPrice)
    const selling = parseFloat(basePrice)

    if (
      !costPrice ||
      !basePrice ||
      isNaN(cost) ||
      isNaN(selling) ||
      cost <= 0 ||
      selling <= 0
    ) {
      setMarginResult(null)
      return
    }

    const margin = selling - cost
    const marginPercent = (margin / selling) * 100
    const markup = selling - cost
    const markupPercent = (markup / cost) * 100

    setMarginResult({
      costPrice: cost,
      sellingPrice: selling,
      margin,
      marginPercent,
      markup,
      markupPercent,
    })
  }, [costPrice, basePrice])

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateBulk()
  }, [calculateBulk])

  useEffect(() => {
    calculateMargin()
  }, [calculateMargin])

  const clearForm = () => {
    setBasePrice('')
    setQuantity('1')
    setCostPrice('')
    setBulkResult(null)
    setMarginResult(null)
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Header Controls */}
      <Card>
        <CardHeader className='pb-4'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <Calculator className='h-5 w-5' />
                Advanced Pricing Calculator
              </CardTitle>
              <CardDescription className='text-sm'>
                Calculate pricing, margins, and bulk discounts for B2B and B2C
                sales
              </CardDescription>
            </div>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
              {/* Business Mode Toggle */}
              <div className='flex items-center gap-2'>
                <span
                  className={cn(
                    'text-sm',
                    businessMode === 'B2C'
                      ? 'font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  B2C
                </span>
                <Switch
                  checked={businessMode === 'B2B'}
                  onCheckedChange={checked =>
                    setBusinessMode(checked ? 'B2B' : 'B2C')
                  }
                />
                <span
                  className={cn(
                    'text-sm',
                    businessMode === 'B2B'
                      ? 'font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  B2B
                </span>
              </div>
              <Badge variant={businessMode === 'B2B' ? 'default' : 'secondary'}>
                {businessMode} Mode
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className='grid gap-4 sm:gap-6 xl:grid-cols-2'>
        {/* Input Panel */}
        <div className='space-y-4 sm:space-y-6'>
          <Card>
            <CardHeader className='pb-4'>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <DollarSign className='h-5 w-5' />
                Pricing Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Base Price */}
              <div className='space-y-2'>
                <Label htmlFor='base-price' className='text-sm font-medium'>
                  Base Selling Price (₹)
                </Label>
                <Input
                  id='base-price'
                  type='number'
                  placeholder='Enter base price'
                  value={basePrice}
                  onChange={e => setBasePrice(e.target.value)}
                  min='0'
                  step='0.01'
                  className='h-10'
                />
              </div>

              {/* Cost Price */}
              <div className='space-y-2'>
                <Label htmlFor='cost-price' className='text-sm font-medium'>
                  Cost Price (₹)
                </Label>
                <Input
                  id='cost-price'
                  type='number'
                  placeholder='Enter cost price'
                  value={costPrice}
                  onChange={e => setCostPrice(e.target.value)}
                  min='0'
                  step='0.01'
                  className='h-10'
                />
              </div>

              {/* Quantity */}
              <div className='space-y-2'>
                <Label htmlFor='quantity' className='text-sm font-medium'>
                  Quantity
                </Label>
                <Input
                  id='quantity'
                  type='number'
                  placeholder='Enter quantity'
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  min='1'
                  className='h-10'
                />
              </div>

              {/* GST Rate */}
              <div className='space-y-2'>
                <Label htmlFor='gst-rate' className='text-sm font-medium'>
                  GST Rate (%)
                </Label>
                <Input
                  id='gst-rate'
                  type='number'
                  value={gstRate}
                  onChange={e => setGSTRate(parseFloat(e.target.value) || 0)}
                  min='0'
                  max='50'
                  step='0.1'
                  className='h-10'
                />
              </div>

              <Button
                variant='outline'
                onClick={clearForm}
                className='h-10 w-full'
              >
                <RefreshCw className='mr-2 h-4 w-4' />
                Clear All
              </Button>
            </CardContent>
          </Card>

          {/* Pricing Tiers */}
          <Card>
            <CardHeader className='pb-4'>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <Users className='h-5 w-5' />
                {businessMode} Pricing Tiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2 sm:space-y-3'>
                {pricingTiers.map((tier, index) => (
                  <div
                    key={index}
                    className='flex flex-col gap-2 rounded border p-3 sm:flex-row sm:items-center sm:justify-between'
                  >
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs'>
                        {tier.name}
                      </Badge>
                      <span className='text-muted-foreground text-xs sm:text-sm'>
                        {tier.minQty}+ units
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Percent className='h-3 w-3' />
                      <span className='text-sm font-medium'>
                        {tier.discountPercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className='space-y-4 sm:space-y-6'>
          <Tabs defaultValue='bulk' className='w-full'>
            <TabsList className='grid h-10 w-full grid-cols-2'>
              <TabsTrigger value='bulk' className='text-sm'>
                Bulk Pricing
              </TabsTrigger>
              <TabsTrigger value='margin' className='text-sm'>
                Margin Analysis
              </TabsTrigger>
            </TabsList>

            {/* Bulk Pricing Results */}
            <TabsContent value='bulk'>
              <Card>
                <CardHeader className='pb-4'>
                  <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                    <Package className='h-5 w-5' />
                    Bulk Pricing Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bulkResult ? (
                    <div className='space-y-4'>
                      {/* Summary */}
                      <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                        <div className='space-y-1'>
                          <p className='text-muted-foreground text-xs sm:text-sm'>
                            Unit Price
                          </p>
                          <p className='text-base font-semibold sm:text-lg'>
                            {formatCurrency(bulkResult.unitPrice)}
                          </p>
                        </div>
                        <div className='space-y-1'>
                          <p className='text-muted-foreground text-xs sm:text-sm'>
                            Quantity
                          </p>
                          <p className='text-base font-semibold sm:text-lg'>
                            {bulkResult.quantity} units
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Discount Details */}
                      {bulkResult.discount.tier && (
                        <div className='space-y-2 sm:space-y-3'>
                          <h4 className='text-sm font-medium sm:text-base'>
                            Applied Discount
                          </h4>
                          <div className='bg-muted rounded-lg p-3'>
                            <div className='mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                              <span className='text-sm font-medium sm:text-base'>
                                {bulkResult.discount.tier.name} Tier
                              </span>
                              <Badge
                                variant='secondary'
                                className='w-fit text-xs'
                              >
                                {bulkResult.discount.percentage}% OFF
                              </Badge>
                            </div>
                            <div className='space-y-1 text-xs sm:text-sm'>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Original Total:
                                </span>
                                <span>
                                  {formatCurrency(bulkResult.originalTotal)}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Discount:
                                </span>
                                <span className='text-green-600'>
                                  -{formatCurrency(bulkResult.discount.amount)}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Subtotal:
                                </span>
                                <span>
                                  {formatCurrency(bulkResult.subtotal)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* GST Breakdown */}
                      <div className='space-y-2 sm:space-y-3'>
                        <h4 className='text-sm font-medium sm:text-base'>
                          Tax Calculation
                        </h4>
                        <div className='space-y-1 text-xs sm:text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              GST ({bulkResult.gst.rate}%):
                            </span>
                            <span>{formatCurrency(bulkResult.gst.amount)}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Final Total */}
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-base font-medium sm:text-lg'>
                            Final Total:
                          </span>
                          <span className='text-primary text-lg font-bold sm:text-xl'>
                            {formatCurrency(bulkResult.finalTotal)}
                          </span>
                        </div>
                        {bulkResult.savings > 0 && (
                          <div className='flex items-center justify-between'>
                            <span className='text-muted-foreground text-sm'>
                              Total Savings:
                            </span>
                            <span className='text-sm font-medium text-green-600'>
                              {formatCurrency(bulkResult.savings)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='text-muted-foreground flex flex-col items-center justify-center py-6 text-center sm:py-8'>
                      <Package className='mb-4 h-10 w-10 opacity-50 sm:h-12 sm:w-12' />
                      <p className='text-base font-medium sm:text-lg'>
                        Enter pricing details
                      </p>
                      <p className='mt-1 text-xs sm:text-sm'>
                        Add base price and quantity to see bulk pricing
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Margin Analysis Results */}
            <TabsContent value='margin'>
              <Card>
                <CardHeader className='pb-4'>
                  <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                    <TrendingUp className='h-5 w-5' />
                    Profit Margin Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {marginResult ? (
                    <div className='space-y-4'>
                      {/* Price Summary */}
                      <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                        <div className='space-y-1'>
                          <p className='text-muted-foreground text-xs sm:text-sm'>
                            Cost Price
                          </p>
                          <p className='text-base font-semibold sm:text-lg'>
                            {formatCurrency(marginResult.costPrice)}
                          </p>
                        </div>
                        <div className='space-y-1'>
                          <p className='text-muted-foreground text-xs sm:text-sm'>
                            Selling Price
                          </p>
                          <p className='text-base font-semibold sm:text-lg'>
                            {formatCurrency(marginResult.sellingPrice)}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Margin Calculations */}
                      <div className='space-y-3'>
                        <h4 className='text-sm font-medium sm:text-base'>
                          Profitability Metrics
                        </h4>

                        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'>
                          <div className='bg-muted rounded-lg p-3'>
                            <div className='space-y-1'>
                              <p className='text-muted-foreground text-xs sm:text-sm'>
                                Gross Margin
                              </p>
                              <p className='text-primary text-lg font-bold sm:text-xl'>
                                {marginResult.marginPercent.toFixed(2)}%
                              </p>
                              <p className='text-muted-foreground text-xs sm:text-sm'>
                                {formatCurrency(marginResult.margin)} profit
                              </p>
                            </div>
                          </div>

                          <div className='bg-muted rounded-lg p-3'>
                            <div className='space-y-1'>
                              <p className='text-muted-foreground text-xs sm:text-sm'>
                                Markup
                              </p>
                              <p className='text-secondary-foreground text-lg font-bold sm:text-xl'>
                                {marginResult.markupPercent.toFixed(2)}%
                              </p>
                              <p className='text-muted-foreground text-xs sm:text-sm'>
                                {formatCurrency(marginResult.markup)} markup
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Margin Health Indicator */}
                        <div className='rounded-lg border p-3'>
                          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                            <span className='text-sm font-medium sm:text-base'>
                              Margin Health:
                            </span>
                            <Badge
                              variant={
                                marginResult.marginPercent >= 30
                                  ? 'default'
                                  : marginResult.marginPercent >= 20
                                    ? 'secondary'
                                    : 'destructive'
                              }
                              className='w-fit text-xs'
                            >
                              {marginResult.marginPercent >= 30
                                ? 'Excellent'
                                : marginResult.marginPercent >= 20
                                  ? 'Good'
                                  : marginResult.marginPercent >= 10
                                    ? 'Fair'
                                    : 'Poor'}
                            </Badge>
                          </div>
                          <p className='text-muted-foreground mt-1 text-xs sm:text-sm'>
                            {marginResult.marginPercent >= 30
                              ? 'High profit margin - very healthy business'
                              : marginResult.marginPercent >= 20
                                ? 'Good profit margin - sustainable business'
                                : marginResult.marginPercent >= 10
                                  ? 'Fair margin - monitor costs carefully'
                                  : 'Low margin - review pricing strategy'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='text-muted-foreground flex flex-col items-center justify-center py-6 text-center sm:py-8'>
                      <BarChart3 className='mb-4 h-10 w-10 opacity-50 sm:h-12 sm:w-12' />
                      <p className='text-base font-medium sm:text-lg'>
                        Enter cost and selling price
                      </p>
                      <p className='mt-1 text-xs sm:text-sm'>
                        Add both prices to analyze profit margins
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
