'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Battery,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Star,
  Twitter,
  Zap,
} from 'lucide-react'

export function FooterSection() {
  const currentYear = new Date().getFullYear()

  const handleContactClick = (method: 'whatsapp' | 'call' | 'email') => {
    switch (method) {
      case 'whatsapp':
        window.open(
          'https://wa.me/918446131207?text=Hi! I would like to know more about your services.',
          '_blank'
        )
        break
      case 'call':
        window.open('tel:+918446131207', '_self')
        break
      case 'email':
        window.open(
          'mailto:contact@rbatteries.com?subject=General Inquiry',
          '_self'
        )
        break
    }
  }

  const handleSocialClick = (platform: string) => {
    // Placeholder for social media links
    console.log(`Redirecting to ${platform}`)
  }

  return (
    <footer className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white dark:from-gray-900 dark:via-slate-800 dark:to-gray-900'>
      {/* Enhanced Background Pattern */}
      <div className='absolute inset-0'>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        {/* Enhanced Floating Elements */}
        <div className='absolute bottom-10 left-10 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl'></div>
        <div className='absolute top-10 right-10 h-36 w-36 animate-pulse rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-3xl delay-1000'></div>
        <div className='absolute top-1/2 left-1/4 h-24 w-24 animate-pulse rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 blur-2xl delay-500'></div>
        <div className='absolute right-1/3 bottom-1/3 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-green-500/15 to-emerald-500/15 blur-2xl delay-700'></div>
      </div>

      <div className='relative'>
        {/* Main Footer Content */}
        <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
          <div className='grid gap-8 lg:grid-cols-4'>
            {/* Company Info */}
            <div className='lg:col-span-2'>
              <div className='mb-6'>
                <h3 className='mb-4 text-3xl font-bold'>
                  <span className='bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent'>
                    R Batteries
                  </span>
                  <span className='mt-1 block text-lg font-medium text-gray-200'>
                    Auto Electrical Works
                  </span>
                </h3>
                <p className='mb-6 max-w-md text-base leading-relaxed text-gray-300'>
                  Your trusted partner for premium batteries, inverters, and
                  auto electrical solutions in Pune. Quality products with
                  expert installation and reliable after-sales service.
                </p>

                {/* Enhanced Trust Badges */}
                <div className='mb-8 flex flex-wrap gap-3'>
                  <Badge
                    variant='secondary'
                    className='border-green-600/30 bg-green-900/40 px-3 py-1.5 text-green-300 backdrop-blur-sm'
                  >
                    <Shield className='mr-2 h-4 w-4' />
                    15+ Years Experience
                  </Badge>
                  <Badge
                    variant='secondary'
                    className='border-blue-600/30 bg-blue-900/40 px-3 py-1.5 text-blue-300 backdrop-blur-sm'
                  >
                    <Star className='mr-2 h-4 w-4' />
                    5000+ Happy Customers
                  </Badge>
                  <Badge
                    variant='secondary'
                    className='border-orange-600/30 bg-orange-900/40 px-3 py-1.5 text-orange-300 backdrop-blur-sm'
                  >
                    <Zap className='mr-2 h-4 w-4' />
                    24/7 Emergency Support
                  </Badge>
                </div>
              </div>

              {/* Enhanced Contact Methods */}
              <div className='grid gap-4 sm:grid-cols-3'>
                <Button
                  onClick={() => handleContactClick('whatsapp')}
                  className='group flex transform items-center gap-3 bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-500 hover:to-green-400 hover:shadow-green-500/25'
                >
                  <MessageCircle className='h-5 w-5 transition-transform duration-300 group-hover:rotate-12' />
                  WhatsApp
                </Button>
                <Button
                  onClick={() => handleContactClick('call')}
                  className='group flex transform items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/25'
                >
                  <Phone className='h-5 w-5 transition-transform duration-300 group-hover:rotate-12' />
                  Call Us
                </Button>
                <Button
                  onClick={() => handleContactClick('email')}
                  className='group flex transform items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-500/25'
                >
                  <Mail className='h-5 w-5 transition-transform duration-300 group-hover:rotate-12' />
                  Email Us
                </Button>
              </div>
            </div>

            {/* Enhanced Quick Links */}
            <div>
              <h4 className='mb-6 text-xl font-semibold text-white'>
                Our Products
              </h4>
              <ul className='space-y-4'>
                <li>
                  <button className='group flex items-center gap-3 rounded-lg p-2 text-gray-300 transition-all duration-300 hover:translate-x-2 hover:bg-orange-500/10 hover:text-orange-400'>
                    <Battery className='h-5 w-5 transition-transform duration-300 group-hover:scale-110' />
                    <span className='font-medium'>Car Batteries</span>
                  </button>
                </li>
                <li>
                  <button className='group flex items-center gap-3 rounded-lg p-2 text-gray-300 transition-all duration-300 hover:translate-x-2 hover:bg-orange-500/10 hover:text-orange-400'>
                    <Battery className='h-5 w-5 transition-transform duration-300 group-hover:scale-110' />
                    <span className='font-medium'>Inverter Batteries</span>
                  </button>
                </li>
                <li>
                  <button className='group flex items-center gap-3 rounded-lg p-2 text-gray-300 transition-all duration-300 hover:translate-x-2 hover:bg-orange-500/10 hover:text-orange-400'>
                    <Zap className='h-5 w-5 transition-transform duration-300 group-hover:scale-110' />
                    <span className='font-medium'>Home Inverters</span>
                  </button>
                </li>
                <li>
                  <button className='group flex items-center gap-3 rounded-lg p-2 text-gray-300 transition-all duration-300 hover:translate-x-2 hover:bg-orange-500/10 hover:text-orange-400'>
                    <Zap className='h-5 w-5 transition-transform duration-300 group-hover:scale-110' />
                    <span className='font-medium'>Solar Inverters</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Enhanced Contact Info */}
            <div>
              <h4 className='mb-6 text-xl font-semibold text-white'>
                Contact Info
              </h4>
              <div className='space-y-5'>
                <div className='group flex items-start gap-4 rounded-lg border border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30'>
                  <MapPin className='mt-1 h-5 w-5 flex-shrink-0 text-orange-400 transition-transform duration-300 group-hover:scale-110' />
                  <div>
                    <p className='font-semibold text-gray-200'>
                      Pune, Maharashtra
                    </p>
                    <p className='mt-1 text-sm text-gray-400'>
                      Free home delivery available
                    </p>
                  </div>
                </div>

                <div className='group flex items-start gap-4 rounded-lg border border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30'>
                  <Phone className='mt-1 h-5 w-5 flex-shrink-0 text-blue-400 transition-transform duration-300 group-hover:scale-110' />
                  <div>
                    <p className='font-semibold text-gray-200'>
                      +91 84461 31207
                    </p>
                    <p className='mt-1 text-sm text-gray-400'>
                      Call anytime 24/7
                    </p>
                  </div>
                </div>

                <div className='group flex items-start gap-4 rounded-lg border border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-green-500/30'>
                  <Clock className='mt-1 h-5 w-5 flex-shrink-0 text-green-400 transition-transform duration-300 group-hover:scale-110' />
                  <div>
                    <p className='font-semibold text-gray-200'>
                      Mon-Sat: 9:00 AM - 8:00 PM
                    </p>
                    <p className='mt-1 text-sm text-gray-400'>
                      Sunday: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='relative'>
          <Separator className='bg-gradient-to-r from-transparent via-gray-600 to-transparent' />
          <div className='absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400'></div>
        </div>

        {/* Enhanced Bottom Footer */}
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
            <div className='text-center text-sm text-gray-300 sm:text-left'>
              <p className='font-medium'>
                © {currentYear} R Batteries Auto Electrical Works. All rights
                reserved.
              </p>
              <p className='mt-2 text-gray-400'>
                Built with ❤️ for better electrical solutions in Pune
              </p>
            </div>

            {/* Enhanced Social Links */}
            <div className='flex items-center gap-4'>
              <span className='mr-2 text-sm text-gray-400'>Follow us:</span>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => handleSocialClick('facebook')}
                className='h-10 w-10 transform rounded-full bg-gray-800/50 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-blue-500/20 hover:text-blue-400'
              >
                <Facebook className='h-5 w-5' />
              </Button>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => handleSocialClick('instagram')}
                className='h-10 w-10 transform rounded-full bg-gray-800/50 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-pink-500/20 hover:text-pink-400'
              >
                <Instagram className='h-5 w-5' />
              </Button>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => handleSocialClick('twitter')}
                className='h-10 w-10 transform rounded-full bg-gray-800/50 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-blue-500/20 hover:text-blue-400'
              >
                <Twitter className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
