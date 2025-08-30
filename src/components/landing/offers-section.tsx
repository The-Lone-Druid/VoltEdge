'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Gift, Percent, Star, Tag } from 'lucide-react'

const specialOffers = [
  {
    id: 1,
    title: 'New Year Special - 10% Off on All Batteries',
    description:
      'Get 10% discount on all battery purchases. Valid until end of January.',
    type: 'PERCENTAGE_DISCOUNT',
    discountValue: 10,
    validUntil: '2025-01-31',
    minimumOrder: 5000,
    maxUsage: 100,
    currentUsage: 23,
    isActive: true,
    highlight: 'Limited Time',
    products: ['All Batteries'],
    terms: 'Minimum order value ₹5,000. Cannot be combined with other offers.',
  },
  {
    id: 2,
    title: 'Inverter + Battery Combo Deal',
    description:
      'Buy any inverter with a compatible battery and save ₹2,000 instantly.',
    type: 'COMBO_DEAL',
    discountValue: 2000,
    validUntil: '2025-02-15',
    minimumOrder: 15000,
    maxUsage: 50,
    currentUsage: 8,
    isActive: true,
    highlight: 'Best Value',
    products: ['Inverters', 'Batteries'],
    terms: 'Applicable on selected inverter and battery combinations only.',
  },
  {
    id: 3,
    title: 'Free Installation',
    description:
      'Get professional installation absolutely free on all inverter purchases.',
    type: 'FREE_SERVICE',
    discountValue: 1500,
    validUntil: '2025-03-01',
    minimumOrder: 8000,
    maxUsage: 75,
    currentUsage: 12,
    isActive: true,
    highlight: 'Most Popular',
    products: ['Inverters'],
    terms: 'Valid for Pune city limits. Installation within 24-48 hours.',
  },
]

const getOfferIcon = (type: string) => {
  switch (type) {
    case 'PERCENTAGE_DISCOUNT':
      return <Percent className='h-5 w-5' />
    case 'COMBO_DEAL':
      return <Gift className='h-5 w-5' />
    case 'FREE_SERVICE':
      return <Star className='h-5 w-5' />
    default:
      return <Tag className='h-5 w-5' />
  }
}

const getOfferColor = (type: string) => {
  switch (type) {
    case 'PERCENTAGE_DISCOUNT':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'COMBO_DEAL':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'FREE_SERVICE':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getHighlightColor = (highlight: string) => {
  switch (highlight) {
    case 'Limited Time':
      return 'bg-red-500'
    case 'Best Value':
      return 'bg-green-500'
    case 'Most Popular':
      return 'bg-blue-500'
    default:
      return 'bg-orange-500'
  }
}

export function OffersSection() {
  const handleClaimOffer = (offerId: number) => {
    const offer = specialOffers.find(o => o.id === offerId)
    const message = `Hi! I'm interested in claiming the "${offer?.title}" offer. Could you please provide more details?`
    window.open(
      `https://wa.me/918446131207?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  const getDaysRemaining = (validUntil: string) => {
    const today = new Date()
    const endDate = new Date(validUntil)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-gray-50 to-white px-4 py-20 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800'>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30 dark:opacity-10"></div>

      <div className='relative mx-auto max-w-7xl'>
        {/* Section Header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500'>
              <Gift className='h-4 w-4 text-white' />
            </div>
            <Badge
              variant='secondary'
              className='bg-orange-100 px-3 py-1 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
            >
              Limited Time
            </Badge>
          </div>

          <h2 className='mb-6 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white'>
            <span className='bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent'>
              Special Offers
            </span>
            <span className='mt-2 block text-gray-700 dark:text-gray-200'>
              & Deals
            </span>
          </h2>

          <p className='mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
            Don&apos;t miss out on these exclusive offers! Save big on premium
            batteries and inverters with our limited-time deals and combo
            packages.
          </p>

          <div className='mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 to-red-500'></div>
        </div>

        {/* Offers Grid - More compact layout */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {specialOffers.map(offer => (
            <Card
              key={offer.id}
              className='group relative transform overflow-hidden border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800/80'
            >
              {/* Gradient Border */}
              <div className='absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
              <div className='absolute inset-[1px] rounded-lg bg-white dark:bg-gray-800'></div>

              {/* Highlight Badge */}
              <div
                className={`absolute top-3 right-3 z-10 ${getHighlightColor(offer.highlight)} rotate-3 transform rounded-full px-2 py-1 text-xs font-bold text-white shadow-md`}
              >
                {offer.highlight}
              </div>

              <CardHeader className='relative z-10 p-4 pb-3 sm:p-6'>
                <div className='mb-4 flex items-start justify-between gap-2'>
                  <Badge
                    variant='outline'
                    className={`${getOfferColor(offer.type)} flex-shrink-0 border text-xs shadow-sm`}
                  >
                    {getOfferIcon(offer.type)}
                    <span className='ml-1 font-semibold capitalize'>
                      {offer.type.replace('_', ' ').toLowerCase()}
                    </span>
                  </Badge>
                  <div className='flex-shrink-0 text-right'>
                    <div className='bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-xl font-bold text-transparent sm:text-2xl'>
                      {offer.type === 'PERCENTAGE_DISCOUNT'
                        ? `${offer.discountValue}% OFF`
                        : `₹${offer.discountValue.toLocaleString('en-IN')} OFF`}
                    </div>
                  </div>
                </div>

                <CardTitle className='line-clamp-2 pr-6 text-base leading-tight text-gray-900 transition-colors duration-300 group-hover:text-orange-600 sm:text-lg dark:text-white dark:group-hover:text-orange-400'>
                  {offer.title}
                </CardTitle>
                <p className='mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-300'>
                  {offer.description}
                </p>
              </CardHeader>

              <CardContent className='relative z-10 p-4 pt-0 sm:p-6'>
                <div className='space-y-4'>
                  {/* Compact Offer Details */}
                  <div className='space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50'>
                    <div className='flex items-center gap-2 text-xs sm:text-sm'>
                      <div className='rounded-full bg-orange-100 p-1.5 dark:bg-orange-900/30'>
                        <Clock className='h-3 w-3 text-orange-600 sm:h-4 sm:w-4 dark:text-orange-400' />
                      </div>
                      <span className='font-medium text-gray-700 dark:text-gray-300'>
                        {getDaysRemaining(offer.validUntil)} days left
                      </span>
                    </div>

                    {offer.minimumOrder > 0 && (
                      <div className='text-xs text-gray-600 dark:text-gray-400'>
                        <span className='font-semibold'>Min:</span> ₹
                        {offer.minimumOrder.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  {/* Compact Usage Progress */}
                  <div className='space-y-2'>
                    <div className='flex justify-between text-xs'>
                      <span className='text-gray-600 dark:text-gray-400'>
                        Claimed
                      </span>
                      <span className='font-semibold text-gray-600 dark:text-gray-400'>
                        {offer.currentUsage}/{offer.maxUsage}
                      </span>
                    </div>
                    <div className='h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600'>
                      <div
                        className='h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm transition-all duration-1000 ease-out'
                        style={{
                          width: `${(offer.currentUsage / offer.maxUsage) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Compact Terms */}
                  <div className='rounded-lg border border-blue-200 bg-blue-50 p-2 sm:p-3 dark:border-blue-800 dark:bg-blue-900/20'>
                    <p className='line-clamp-2 text-xs leading-relaxed text-blue-800 dark:text-blue-300'>
                      <span className='font-semibold'>Terms:</span>{' '}
                      {offer.terms}
                    </p>
                  </div>

                  {/* Compact Action Button */}
                  <Button
                    onClick={() => handleClaimOffer(offer.id)}
                    className='w-full transform bg-gradient-to-r from-orange-500 to-red-500 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:from-orange-600 hover:to-red-600 hover:shadow-lg sm:py-3'
                    disabled={offer.currentUsage >= offer.maxUsage}
                    size='sm'
                  >
                    {offer.currentUsage >= offer.maxUsage
                      ? 'Offer Exhausted'
                      : 'Claim This Offer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className='mt-16 text-center'>
          <Card className='mx-auto max-w-4xl border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl backdrop-blur-sm dark:border-blue-700 dark:from-blue-900/30 dark:to-blue-800/30'>
            <CardContent className='p-8'>
              <div className='mb-4 flex items-center justify-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg'>
                  <span className='text-2xl'>🎉</span>
                </div>
                <h3 className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                  More Offers Coming Soon!
                </h3>
              </div>

              <p className='mb-6 text-lg leading-relaxed text-blue-700 dark:text-blue-300'>
                Follow us on WhatsApp for instant notifications about flash
                sales, exclusive deals, and new product launches.
              </p>

              <Button
                variant='outline'
                size='lg'
                className='transform border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-xl dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500'
                onClick={() =>
                  window.open(
                    'https://wa.me/918446131207?text=Hi! Please add me to your offers notification list.',
                    '_blank'
                  )
                }
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-500'>
                    <span className='text-xs text-white'>📱</span>
                  </div>
                  Get Notified on WhatsApp
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
