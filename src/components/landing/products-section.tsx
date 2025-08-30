'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Battery,
  Car,
  IndianRupee,
  ShoppingCart,
  Star,
  Zap,
} from 'lucide-react'
import Image from 'next/image'

const products = [
  {
    id: 1,
    name: 'Exide FMI0-MRED150D31R',
    category: 'BATTERY',
    type: 'Maintenance Free',
    capacity: '150Ah',
    voltage: '12V',
    warranty: '48 months',
    price: 18500,
    originalPrice: 22000,
    image: 'https://placehold.co/400x300/3B82F6/FFFFFF/png?text=Exide+Battery',
    features: ['Zero Maintenance', 'Long Life', 'High Performance'],
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 2,
    name: 'Luminous Zelio+ 1100VA',
    category: 'INVERTER',
    type: 'Pure Sine Wave',
    capacity: '1100VA',
    voltage: '12V',
    warranty: '24 months',
    price: 12800,
    originalPrice: 15000,
    image:
      'https://placehold.co/400x300/10B981/FFFFFF/png?text=Luminous+Inverter',
    features: ['Pure Sine Wave', 'LCD Display', 'Overload Protection'],
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 3,
    name: 'Amaron GO 105D31R',
    category: 'BATTERY',
    type: 'Car Battery',
    capacity: '80Ah',
    voltage: '12V',
    warranty: '42 months',
    price: 9500,
    originalPrice: 11200,
    image: 'https://placehold.co/400x300/F59E0B/FFFFFF/png?text=Amaron+Battery',
    features: ['Zero Maintenance', 'Longer Life', 'High Cranking Power'],
    rating: 4.7,
    reviews: 234,
  },
  {
    id: 4,
    name: 'Microtek UPS EB 1600VA',
    category: 'INVERTER',
    type: 'Square Wave',
    capacity: '1600VA',
    voltage: '12V',
    warranty: '24 months',
    price: 8900,
    originalPrice: 10500,
    image: 'https://placehold.co/400x300/8B5CF6/FFFFFF/png?text=Microtek+UPS',
    features: ['Auto Start', 'Overload Protection', 'LED Indicators'],
    rating: 4.4,
    reviews: 67,
  },
  {
    id: 5,
    name: 'Luminous Red Charge RC18000ST',
    category: 'BATTERY',
    type: 'Tubular',
    capacity: '150Ah',
    voltage: '12V',
    warranty: '60 months',
    price: 16200,
    originalPrice: 19000,
    image:
      'https://placehold.co/400x300/EF4444/FFFFFF/png?text=Luminous+Tubular',
    features: ['Tubular Technology', 'Deep Cycle', 'Long Backup'],
    rating: 4.9,
    reviews: 445,
  },
  {
    id: 6,
    name: 'V-Guard Prime 1050VA',
    category: 'INVERTER',
    type: 'Pure Sine Wave',
    capacity: '1050VA',
    voltage: '12V',
    warranty: '24 months',
    price: 11500,
    originalPrice: 13800,
    image:
      'https://placehold.co/400x300/06B6D4/FFFFFF/png?text=V-Guard+Inverter',
    features: ['Pure Sine Wave', 'Smart Charging', 'Auto Restart'],
    rating: 4.5,
    reviews: 112,
  },
]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'BATTERY':
      return <Battery className='h-5 w-5' />
    case 'INVERTER':
      return <Zap className='h-5 w-5' />
    default:
      return <Car className='h-5 w-5' />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'BATTERY':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'INVERTER':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function ProductsSection() {
  const handleRequestQuote = (productId: number) => {
    const product = products.find(p => p.id === productId)
    const message = `Hi! I'm interested in ${product?.name}. Could you please provide a detailed quotation?`
    window.open(
      `https://wa.me/918446131207?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  return (
    <section className='bg-gradient-to-b from-gray-50 to-white px-4 py-20 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800'>
      <div className='mx-auto max-w-7xl'>
        {/* Section Header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2'>
            <Badge
              variant='outline'
              className='border-blue-200 bg-blue-100 px-4 py-2 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300'
            >
              <Zap className='mr-2 h-4 w-4' />
              Featured Products
            </Badge>
          </div>
          <h2 className='mb-6 text-4xl leading-relaxed font-bold text-gray-900 sm:text-5xl dark:text-white'>
            Our Premium
            <span className='block bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text pb-1 text-transparent'>
              Product Range
            </span>
          </h2>
          <p className='mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300'>
            Browse our carefully selected range of batteries and inverters from
            trusted brands. All products come with genuine warranty and
            professional installation.
          </p>
        </div>

        {/* Products Grid - More compact layout */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {products.map(product => (
            <Card
              key={product.id}
              className='group overflow-hidden border-0 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 dark:bg-gray-800'
            >
              <CardHeader className='relative pb-3'>
                <div className='relative mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600'>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                  />
                  {product.originalPrice > product.price && (
                    <Badge className='absolute top-2 right-2 animate-pulse border-0 bg-gradient-to-r from-red-500 to-red-600 text-xs text-white shadow-md'>
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </Badge>
                  )}
                  <div className='absolute top-2 left-2'>
                    <Badge
                      variant='secondary'
                      className={`${getCategoryColor(product.category)} border-0 text-xs shadow-md backdrop-blur-sm`}
                    >
                      {getCategoryIcon(product.category)}
                      <span className='ml-1 font-medium'>
                        {product.category}
                      </span>
                    </Badge>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                      <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                      <span className='text-xs font-semibold text-gray-900 dark:text-white'>
                        {product.rating}
                      </span>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        ({product.reviews})
                      </span>
                    </div>
                    <Badge
                      variant='outline'
                      className='border-green-200 bg-green-50 text-xs text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-300'
                    >
                      In Stock
                    </Badge>
                  </div>

                  <CardTitle className='line-clamp-2 text-base leading-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                    {product.name}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className='space-y-3 pt-0'>
                {/* Features - More prominent on home screen */}
                <div className='space-y-2'>
                  <div className='flex flex-wrap gap-1'>
                    {product.features
                      .slice(0, 3)
                      .map((feature, featureIndex) => (
                        <Badge
                          key={featureIndex}
                          variant='secondary'
                          className='border-blue-200 bg-blue-50 text-xs text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        >
                          {feature}
                        </Badge>
                      ))}
                    {product.features.length > 3 && (
                      <Badge
                        variant='secondary'
                        className='border-gray-200 bg-gray-50 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
                      >
                        +{product.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Pricing Section */}
                <div className='border-t pt-3 dark:border-gray-700'>
                  <div className='mb-3 space-y-1'>
                    <div className='flex items-center gap-1'>
                      <IndianRupee className='h-4 w-4 text-green-600 dark:text-green-400' />
                      <span className='text-xl font-bold text-green-600 dark:text-green-400'>
                        {product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {product.originalPrice > product.price && (
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center text-gray-500 line-through dark:text-gray-400'>
                          <IndianRupee className='h-3 w-3' />
                          <span className='text-xs'>
                            {product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <Badge
                          variant='outline'
                          className='border-red-200 bg-red-50 text-xs text-red-600 dark:border-red-700 dark:bg-red-900 dark:text-red-300'
                        >
                          Save ₹
                          {(
                            product.originalPrice - product.price
                          ).toLocaleString('en-IN')}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleRequestQuote(product.id)}
                    className='group w-full transform bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
                    size='sm'
                  >
                    <ShoppingCart className='mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12' />
                    Request Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Products */}
        <div className='mt-16 text-center'>
          <div className='mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-blue-50 to-orange-50 p-8 dark:from-blue-900/20 dark:to-orange-900/20'>
            <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
              Need something specific?
            </h3>
            <p className='mb-6 text-gray-600 dark:text-gray-300'>
              We have a wide range of products beyond what&apos;s shown here.
              Get in touch for custom solutions!
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Button
                variant='outline'
                size='lg'
                className='border-2 border-blue-600 text-blue-600 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              >
                View All Products
                <span className='ml-2'>→</span>
              </Button>
              <Button
                size='lg'
                className='bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
              >
                Get Custom Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
