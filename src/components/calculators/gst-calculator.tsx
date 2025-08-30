'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import {
  Calculator,
  RefreshCw,
  Info,
  ArrowRightLeft,
  Copy,
  Check,
  History,
  AlertCircle,
  ChevronDown,
} from 'lucide-react'

interface CategoryGSTInfo {
  category: string
  rate: number
  description: string
  productCount: number
}

interface GSTCalculation {
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

interface PriceCalculation {
  inclusivePrice: number
  exclusivePrice: number
  gstAmount: number
  gstRate: number
}

interface CalculationHistory {
  id: string
  timestamp: Date
  amount: number
  gstRate: number
  category: string
  isInclusive: boolean
  result: GSTCalculation
}

export function GSTCalculator() {
  const { data: session } = useSession()

  // Form state
  const [amount, setAmount] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [gstRate, setGSTRate] = useState<number>(18)
  const [isInclusive, setIsInclusive] = useState<boolean>(false)
  const [isIntraState, setIsIntraState] = useState<boolean>(true)

  // Data state
  const [categories, setCategories] = useState<CategoryGSTInfo[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Calculation results
  const [calculation, setCalculation] = useState<GSTCalculation | null>(null)
  const [priceCalculation, setPriceCalculation] =
    useState<PriceCalculation | null>(null)

  // UI state
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [categoryOpen, setCategoryOpen] = useState<boolean>(false)

  // Fetch GST rates from API
  useEffect(() => {
    const fetchGSTRates = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/gst/rates')
        const data = await response.json()

        if (data.success) {
          setCategories(data.gstRates)
          // Set default category if available
          if (data.gstRates.length > 0 && !selectedCategory) {
            const defaultCategory =
              data.gstRates.find((c: CategoryGSTInfo) => c.productCount > 0) ||
              data.gstRates[0]
            setSelectedCategory(defaultCategory.category)
            setGSTRate(defaultCategory.rate)
          }
        } else {
          setError('Failed to load GST rates')
        }
      } catch (err) {
        setError('Error loading GST rates')
        console.error('Error fetching GST rates:', err)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchGSTRates()
    }
  }, [session?.user?.id, selectedCategory])

  // Calculate GST
  const calculateGST = useCallback(
    (amount: number, rate: number, isIntraState: boolean): GSTCalculation => {
      const gstAmount = (amount * rate) / 100
      const totalAmount = amount + gstAmount

      const cgst = isIntraState ? gstAmount / 2 : 0
      const sgst = isIntraState ? gstAmount / 2 : 0
      const igst = isIntraState ? 0 : gstAmount

      return {
        originalAmount: amount,
        gstRate: rate,
        gstAmount,
        totalAmount,
        breakdown: {
          baseAmount: amount,
          cgst,
          sgst,
          igst,
          totalGst: gstAmount,
        },
        isIntraState,
      }
    },
    []
  )

  // Calculate prices
  const calculatePrices = useCallback(
    (amount: number, rate: number, inclusive: boolean): PriceCalculation => {
      if (inclusive) {
        // Amount includes GST
        const exclusivePrice = (amount * 100) / (100 + rate)
        const gstAmount = amount - exclusivePrice

        return {
          inclusivePrice: amount,
          exclusivePrice,
          gstAmount,
          gstRate: rate,
        }
      } else {
        // Amount excludes GST
        const gstAmount = (amount * rate) / 100
        const inclusivePrice = amount + gstAmount

        return {
          inclusivePrice,
          exclusivePrice: amount,
          gstAmount,
          gstRate: rate,
        }
      }
    },
    []
  )

  // Calculate result function
  const calculateResult = useCallback(() => {
    const numAmount = parseFloat(amount)

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setCalculation(null)
      setPriceCalculation(null)
      setError('')
      return
    }

    if (gstRate < 0 || gstRate > 50) {
      setError('GST rate must be between 0% and 50%')
      return
    }

    setError('')

    try {
      const priceCalc = calculatePrices(numAmount, gstRate, isInclusive)
      setPriceCalculation(priceCalc)

      const gstCalc = calculateGST(
        priceCalc.exclusivePrice,
        gstRate,
        isIntraState
      )
      setCalculation(gstCalc)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error')
      setCalculation(null)
      setPriceCalculation(null)
    }
  }, [
    amount,
    gstRate,
    isInclusive,
    isIntraState,
    calculateGST,
    calculatePrices,
  ])

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateResult()
  }, [calculateResult])

  // Handle category change
  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue)
    const categoryInfo = categories.find(c => c.category === categoryValue)
    if (categoryInfo) {
      setGSTRate(categoryInfo.rate)
    }
  }

  // Save to history
  const saveToHistory = async () => {
    if (!calculation || !amount || !selectedCategory) return

    const historyItem: CalculationHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      amount: parseFloat(amount),
      gstRate,
      category: selectedCategory,
      isInclusive,
      result: calculation,
    }

    setHistory(prev => [historyItem, ...prev.slice(0, 9)]) // Keep last 10 calculations

    // Log the calculation to the backend
    try {
      await fetch('/api/gst/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          gstRate,
          category: selectedCategory,
          isInclusive,
          isIntraState,
          calculationResult: calculation,
        }),
      })
    } catch (error) {
      console.error('Failed to log GST calculation:', error)
      // Don't show error to user for logging failures
    }
  }

  // Clear form
  const clearForm = () => {
    setAmount('')
    setCalculation(null)
    setPriceCalculation(null)
    setError('')
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatCalculationSummary = () => {
    if (!calculation || !priceCalculation || !selectedCategory) return ''

    const categoryInfo = categories.find(c => c.category === selectedCategory)

    return `
        GST Calculation Summary:
        Product Category: ${categoryInfo?.description || selectedCategory}
        ${isInclusive ? 'Inclusive' : 'Exclusive'} Amount: ${formatCurrency(parseFloat(amount))}
        GST Rate: ${gstRate}%
        Base Amount: ${formatCurrency(calculation.originalAmount)}
        GST Amount: ${formatCurrency(calculation.gstAmount)}
        Total Amount: ${formatCurrency(calculation.totalAmount)}
        ${isIntraState ? `CGST: ${formatCurrency(calculation.breakdown.cgst)}, SGST: ${formatCurrency(calculation.breakdown.sgst)}` : `IGST: ${formatCurrency(calculation.breakdown.igst)}`}
    `.trim()
  }

  if (loading) {
    return (
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-4 w-64' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-7xl space-y-4 overflow-hidden sm:space-y-6'>
      <div className='grid gap-4 sm:gap-6 xl:grid-cols-2'>
        {/* Input Panel */}
        <Card className='min-w-0 overflow-hidden'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
              <Calculator className='h-5 w-5' />
              Calculate GST
            </CardTitle>
            <CardDescription className='text-sm'>
              Calculate GST for your electrical products with real-time rates
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Product Category Selection */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Product Category</Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={categoryOpen}
                    className='h-10 w-full justify-between'
                  >
                    {selectedCategory
                      ? categories.find(c => c.category === selectedCategory)
                          ?.description
                      : 'Select product category...'}
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0' align='start'>
                  <Command>
                    <CommandInput
                      placeholder='Search categories...'
                      className='h-9'
                    />
                    <CommandList className='max-h-[200px]'>
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map(category => (
                          <CommandItem
                            key={category.category}
                            value={category.description}
                            onSelect={() => {
                              handleCategoryChange(category.category)
                              setCategoryOpen(false)
                            }}
                            className='p-3'
                          >
                            <div className='flex w-full items-start justify-between gap-2'>
                              <div className='min-w-0 flex-1'>
                                <div className='truncate text-sm font-medium'>
                                  {category.description}
                                </div>
                                <div className='mt-1 flex items-center gap-1'>
                                  <Badge
                                    variant='secondary'
                                    className='h-5 text-xs'
                                  >
                                    {category.rate}%
                                  </Badge>
                                  {category.productCount > 0 && (
                                    <Badge
                                      variant='outline'
                                      className='h-5 text-xs'
                                    >
                                      {category.productCount} items
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedCategory && (
                <p className='text-muted-foreground text-xs sm:text-sm'>
                  {
                    categories.find(c => c.category === selectedCategory)
                      ?.description
                  }{' '}
                  • {gstRate}% GST
                </p>
              )}
            </div>

            {/* Amount Input */}
            <div className='space-y-2'>
              <Label htmlFor='amount' className='text-sm font-medium'>
                Amount {isInclusive ? '(GST Inclusive)' : '(GST Exclusive)'}
              </Label>
              <div className='relative'>
                <span className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
                  ₹
                </span>
                <Input
                  id='amount'
                  type='number'
                  placeholder='Enter amount'
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className='h-10 pl-8'
                  min='0'
                  step='0.01'
                />
              </div>
            </div>

            {/* Custom GST Rate (if needed) */}
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

            {/* Toggle Options */}
            <div className='space-y-4'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='price-type' className='text-sm font-medium'>
                    Price Type
                  </Label>
                  <p className='text-muted-foreground text-xs sm:text-sm'>
                    {isInclusive
                      ? 'Amount includes GST'
                      : 'Amount excludes GST'}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <span
                    className={cn(
                      'text-sm',
                      !isInclusive ? 'font-medium' : 'text-muted-foreground'
                    )}
                  >
                    Exclusive
                  </span>
                  <Switch
                    id='price-type'
                    checked={isInclusive}
                    onCheckedChange={setIsInclusive}
                  />
                  <span
                    className={cn(
                      'text-sm',
                      isInclusive ? 'font-medium' : 'text-muted-foreground'
                    )}
                  >
                    Inclusive
                  </span>
                </div>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='state-type' className='text-sm font-medium'>
                    Transaction Type
                  </Label>
                  <p className='text-muted-foreground text-xs sm:text-sm'>
                    {isIntraState
                      ? 'Same state (CGST + SGST)'
                      : 'Different state (IGST)'}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <span
                    className={cn(
                      'text-sm',
                      !isIntraState ? 'font-medium' : 'text-muted-foreground'
                    )}
                  >
                    Inter-state
                  </span>
                  <Switch
                    id='state-type'
                    checked={isIntraState}
                    onCheckedChange={setIsIntraState}
                  />
                  <span
                    className={cn(
                      'text-sm',
                      isIntraState ? 'font-medium' : 'text-muted-foreground'
                    )}
                  >
                    Intra-state
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-2 sm:flex-row sm:gap-3'>
              <Button
                variant='outline'
                onClick={clearForm}
                className='h-10 flex-1'
              >
                <RefreshCw className='mr-2 h-4 w-4' />
                Clear
              </Button>
              <Button
                onClick={saveToHistory}
                disabled={!calculation}
                className='h-10 flex-1'
              >
                <History className='mr-2 h-4 w-4' />
                Save
              </Button>
            </div>

            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription className='text-sm'>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className='min-w-0 overflow-hidden'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center justify-between text-lg sm:text-xl'>
              <span className='flex min-w-0 items-center gap-2'>
                <ArrowRightLeft className='h-5 w-5 flex-shrink-0' />
                <span className='truncate'>Calculation Results</span>
              </span>
              {calculation && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => copyToClipboard(formatCalculationSummary())}
                  className='h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-2'
                >
                  {copied ? (
                    <Check className='h-4 w-4' />
                  ) : (
                    <Copy className='h-4 w-4' />
                  )}
                  <span className='sr-only sm:not-sr-only sm:ml-2'>Copy</span>
                </Button>
              )}
            </CardTitle>
            <CardDescription className='text-sm'>
              GST breakdown and price calculations based on your product data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {calculation && priceCalculation ? (
              <div className='space-y-4'>
                {/* Price Summary */}
                <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                  <div className='space-y-1'>
                    <p className='text-muted-foreground text-xs sm:text-sm'>
                      Base Amount
                    </p>
                    <p className='text-base font-semibold sm:text-lg'>
                      {formatCurrency(calculation.originalAmount)}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-muted-foreground text-xs sm:text-sm'>
                      Total Amount
                    </p>
                    <p className='text-primary text-base font-semibold sm:text-lg'>
                      {formatCurrency(calculation.totalAmount)}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* GST Breakdown */}
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium sm:text-base'>
                    GST Breakdown ({gstRate}%)
                  </h4>

                  <div className='space-y-2 text-xs sm:text-sm'>
                    {isIntraState ? (
                      <div className='grid gap-2'>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>
                            CGST ({gstRate / 2}%):
                          </span>
                          <span className='font-medium'>
                            {formatCurrency(calculation.breakdown.cgst)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>
                            SGST ({gstRate / 2}%):
                          </span>
                          <span className='font-medium'>
                            {formatCurrency(calculation.breakdown.sgst)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>
                          IGST ({gstRate}%):
                        </span>
                        <span className='font-medium'>
                          {formatCurrency(calculation.breakdown.igst)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className='bg-muted flex justify-between rounded-lg p-3'>
                    <span className='text-sm font-medium sm:text-base'>
                      Total GST:
                    </span>
                    <span className='text-primary text-sm font-semibold sm:text-base'>
                      {formatCurrency(calculation.gstAmount)}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Price Conversion */}
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium sm:text-base'>
                    Price Conversion
                  </h4>
                  <div className='grid gap-2 text-xs sm:text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        GST Exclusive Price:
                      </span>
                      <span className='font-medium'>
                        {formatCurrency(priceCalculation.exclusivePrice)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        GST Inclusive Price:
                      </span>
                      <span className='font-medium'>
                        {formatCurrency(priceCalculation.inclusivePrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Alert */}
                <Alert>
                  <Info className='h-4 w-4' />
                  <AlertDescription className='text-xs sm:text-sm'>
                    {isIntraState
                      ? 'Intra-state transaction: GST split equally between CGST and SGST'
                      : 'Inter-state transaction: Full GST amount charged as IGST'}
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className='text-muted-foreground flex flex-col items-center justify-center py-6 text-center sm:py-8'>
                <Calculator className='mb-4 h-10 w-10 opacity-50 sm:h-12 sm:w-12' />
                <p className='text-base font-medium sm:text-lg'>
                  Enter amount to calculate GST
                </p>
                <p className='mt-1 text-xs sm:text-sm'>
                  Choose a product category and enter the amount to see GST
                  breakdown
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calculation History */}
      {history.length > 0 && (
        <Card className='min-w-0 overflow-hidden'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
              <History className='h-5 w-5 flex-shrink-0' />
              <span className='truncate'>Recent Calculations</span>
            </CardTitle>
            <CardDescription className='text-sm'>
              Your recent GST calculations for quick reference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2 sm:space-y-3'>
              {history.slice(0, 5).map(item => (
                <div
                  key={item.id}
                  className='border-border hover:bg-muted/50 flex flex-col gap-3 rounded-lg border p-3 transition-colors sm:flex-row sm:items-center sm:justify-between'
                >
                  <div className='flex items-center gap-2 sm:gap-3'>
                    <Badge variant='outline' className='text-xs'>
                      {item.gstRate}%
                    </Badge>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-medium sm:text-base'>
                        {formatCurrency(item.amount)}{' '}
                        <span className='text-muted-foreground text-xs sm:text-sm'>
                          {item.isInclusive ? '(Inc.)' : '(Exc.)'}
                        </span>
                      </p>
                      <p className='text-muted-foreground truncate text-xs sm:text-sm'>
                        {categories.find(c => c.category === item.category)
                          ?.description || item.category}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {item.timestamp.toLocaleDateString()}{' '}
                        {item.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className='text-left sm:text-right'>
                    <p className='text-sm font-medium sm:text-base'>
                      {formatCurrency(item.result.totalAmount)}
                    </p>
                    <p className='text-muted-foreground text-xs sm:text-sm'>
                      GST: {formatCurrency(item.result.gstAmount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
