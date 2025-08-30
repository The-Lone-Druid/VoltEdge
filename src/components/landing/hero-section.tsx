'use client'

import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'

export function HeroSection() {
  const handleWhatsAppClick = () => {
    window.open(
      'https://wa.me/918446131207?text=Hi! I would like to know more about your batteries and inverters.',
      '_blank'
    )
  }

  const handleCallClick = () => {
    window.open('tel:+918446131207', '_self')
  }

  const handleEmailClick = () => {
    window.open(
      'mailto:contact@rbatteries.com?subject=Inquiry about products',
      '_self'
    )
  }

  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4 pt-6 pb-20 text-white sm:px-6 md:pt-8 lg:px-8 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0'>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        {/* Floating Elements - More prominent */}
        <div className='absolute top-20 left-20 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-orange-400/20 to-red-400/20 blur-2xl'></div>
        <div className='absolute top-40 right-32 h-40 w-40 animate-pulse rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-2xl delay-1000'></div>
        <div className='absolute bottom-20 left-32 h-36 w-36 animate-pulse rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-2xl delay-500'></div>
        <div className='absolute top-1/2 right-20 h-24 w-24 animate-pulse rounded-full bg-gradient-to-r from-green-400/15 to-emerald-400/15 blur-xl delay-700'></div>
      </div>

      <div className='relative mx-auto max-w-7xl'>
        {/* Theme Toggle - Floating in top right */}
        <div className='absolute top-0 right-0 z-10'>
          <AnimatedThemeToggler />
        </div>

        <div className='grid items-center gap-12 lg:grid-cols-2'>
          {/* Left Side - Business Info */}
          <div className='space-y-8'>
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <Badge
                  variant='secondary'
                  className='border-orange-500/20 bg-orange-500/20 px-4 py-2 text-sm font-medium text-orange-200 backdrop-blur-sm'
                >
                  <Sparkles className='mr-2 h-4 w-4' />
                  Trusted Since 2010
                </Badge>
              </div>

              <h1 className='text-5xl leading-tight font-bold sm:text-6xl lg:text-7xl'>
                <span className='bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent'>
                  R Batteries
                </span>
                <span className='block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>
                  Auto Electrical Works
                </span>
              </h1>

              <p className='max-w-2xl text-lg leading-relaxed text-gray-200 sm:text-xl lg:text-2xl'>
                Complete electrical solutions for modern businesses. From GST
                calculations to battery warranties, we&apos;ve got you covered
                with our comprehensive B2B platform.
              </p>
            </div>

            {/* Enhanced Contact Actions */}
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Button
                onClick={handleWhatsAppClick}
                size='lg'
                className='flex transform items-center gap-3 bg-green-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-700 hover:shadow-xl'
              >
                <MessageCircle className='h-5 w-5' />
                WhatsApp Us
                <div className='h-2 w-2 animate-ping rounded-full bg-green-300'></div>
              </Button>

              <Button
                onClick={handleCallClick}
                size='lg'
                className='flex items-center gap-3 border border-blue-500 bg-blue-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:bg-blue-700'
              >
                <Phone className='h-5 w-5' />
                Call Now
              </Button>

              <Button
                onClick={handleEmailClick}
                size='lg'
                className='flex items-center gap-3 border border-purple-500 bg-purple-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:bg-purple-700'
              >
                <Mail className='h-5 w-5' />
                Email Us
              </Button>
            </div>

            {/* Enhanced Quick Info */}
            <div className='grid gap-6 pt-8 sm:grid-cols-2'>
              <div className='flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 text-blue-100/90 backdrop-blur-sm dark:text-gray-300'>
                <div className='rounded-lg bg-orange-500/20 p-3'>
                  <MapPin className='h-6 w-6 text-orange-400' />
                </div>
                <div>
                  <div className='font-semibold text-white'>
                    Pune, Maharashtra
                  </div>
                  <div className='text-sm opacity-80'>Free Home Delivery</div>
                </div>
              </div>

              <div className='flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 text-blue-100/90 backdrop-blur-sm dark:text-gray-300'>
                <div className='rounded-lg bg-blue-500/20 p-3'>
                  <Clock className='h-6 w-6 text-blue-400' />
                </div>
                <div>
                  <div className='font-semibold text-white'>Open Daily</div>
                  <div className='text-sm opacity-80'>9:00 AM - 8:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Stats Card */}
          <div className='lg:justify-self-end'>
            <Card className='hover:shadow-3xl transform border-white/20 bg-white/10 shadow-2xl backdrop-blur-lg transition-all duration-500 hover:scale-105'>
              <CardContent className='p-8'>
                <div className='mb-8 text-center'>
                  <div className='mb-4 inline-flex items-center gap-2'>
                    <Shield className='h-6 w-6 text-orange-400' />
                    <h3 className='text-2xl font-bold text-white'>
                      Why Choose Us?
                    </h3>
                  </div>
                  <div className='mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-300'></div>
                </div>

                <div className='grid grid-cols-2 gap-8'>
                  <div className='group text-center'>
                    <div className='relative'>
                      <div className='text-4xl font-bold text-orange-400 transition-transform duration-300 group-hover:scale-110'>
                        15+
                      </div>
                      <Zap className='absolute -top-2 -right-2 h-4 w-4 animate-pulse text-yellow-400' />
                    </div>
                    <div className='mt-2 text-sm font-medium text-blue-100'>
                      Years Experience
                    </div>
                  </div>

                  <div className='group text-center'>
                    <div className='relative'>
                      <div className='text-4xl font-bold text-orange-400 transition-transform duration-300 group-hover:scale-110'>
                        5000+
                      </div>
                      <Sparkles className='absolute -top-2 -right-2 h-4 w-4 animate-pulse text-yellow-400 delay-300' />
                    </div>
                    <div className='mt-2 text-sm font-medium text-blue-100'>
                      Happy Customers
                    </div>
                  </div>

                  <div className='group text-center'>
                    <div className='relative'>
                      <div className='text-4xl font-bold text-orange-400 transition-transform duration-300 group-hover:scale-110'>
                        24/7
                      </div>
                    </div>
                    <div className='mt-2 text-sm font-medium text-blue-100'>
                      Support
                    </div>
                  </div>

                  <div className='group text-center'>
                    <div className='relative'>
                      <div className='text-4xl font-bold text-orange-400 transition-transform duration-300 group-hover:scale-110'>
                        100%
                      </div>
                    </div>
                    <div className='mt-2 text-sm font-medium text-blue-100'>
                      Genuine Parts
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className='mt-8 border-t border-white/20 pt-6'>
                  <div className='flex items-center justify-center gap-6 text-xs text-blue-200'>
                    <div className='flex items-center gap-1'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-green-400'></div>
                      <span>ISO Certified</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-blue-400 delay-300'></div>
                      <span>Authorized Dealer</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-orange-400 delay-700'></div>
                      <span>5★ Rated</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
