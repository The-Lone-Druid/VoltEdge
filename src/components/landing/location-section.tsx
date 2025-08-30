'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, MapPin, Phone } from 'lucide-react'

export function LocationSection() {
  const businessInfo = {
    name: 'R Batteries Auto Electrical Works',
    address: 'Pune, Maharashtra',
    phone: '+91 84461 31207',
    email: 'contact@rbatteries.com',
    hours: {
      weekdays: '9:00 AM - 8:00 PM',
      sunday: '9:00 AM - 6:00 PM',
    },
    googleMapsUrl: 'https://maps.app.goo.gl/SgeX42ETpPfJvqoK9',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3636.7734551465664!2d73.88803887501146!3d18.456018682625075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2ebeab11678c1%3A0xf393d7053d3e2e98!2sR%20Batteries%20Auto%20Electrical%20Works!5e1!3m2!1sen!2sin!4v1756571068594!5m2!1sen!2sin',
  }

  const handleDirections = () => {
    window.open(businessInfo.googleMapsUrl, '_blank')
  }

  const handleCall = () => {
    window.open(`tel:${businessInfo.phone}`, '_self')
  }

  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-20 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 right-20 h-40 w-40 rounded-full bg-blue-400/5 blur-3xl dark:bg-blue-400/10'></div>
        <div className='absolute bottom-20 left-20 h-32 w-32 rounded-full bg-orange-400/5 blur-3xl dark:bg-orange-400/10'></div>
      </div>

      <div className='relative mx-auto'>
        {/* Section Header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600'>
              <MapPin className='h-4 w-4 text-white' />
            </div>
            <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
              Find Us
            </span>
          </div>

          <h2 className='mb-6 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white'>
            <span className='bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent'>
              Visit Our Store
            </span>
          </h2>

          <p className='mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
            Find us easily with our location details. We&apos;re here to serve
            you with expert advice and quality products.
          </p>

          <div className='mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600'></div>
        </div>

        {/* Contact Information */}
        <div className='space-y-8'>
          <div className='grid gap-8 lg:grid-cols-2'>
            {/* Contact Info Card */}
            <Card className='hover:shadow-3xl border-0 bg-white/90 shadow-2xl backdrop-blur-sm transition-all duration-500 dark:bg-gray-800/90'>
              <CardContent className='p-4 sm:p-6 md:p-8'>
                <div className='mb-4 flex items-center gap-3 sm:mb-6 md:mb-8'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 sm:h-10 sm:w-10'>
                    <Phone className='h-4 w-4 text-white sm:h-5 sm:w-5' />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 sm:text-xl md:text-2xl dark:text-white'>
                    Contact Information
                  </h3>
                </div>

                <div className='space-y-3 sm:space-y-4 md:space-y-6'>
                  {/* Address */}
                  <div className='flex items-start gap-3 rounded-xl bg-gray-50 p-3 transition-colors duration-300 hover:bg-gray-100 sm:gap-4 sm:p-4 dark:bg-gray-700/50 dark:hover:bg-gray-700'>
                    <div className='flex-shrink-0 rounded-xl bg-blue-100 p-2 sm:p-3 dark:bg-blue-900/30'>
                      <MapPin className='h-4 w-4 text-blue-600 sm:h-5 sm:w-5 md:h-6 md:w-6 dark:text-blue-400' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h4 className='mb-1 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-base dark:text-white'>
                        Address
                      </h4>
                      <p className='text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base dark:text-gray-300'>
                        {businessInfo.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className='flex items-start gap-3 rounded-xl bg-gray-50 p-3 transition-colors duration-300 hover:bg-gray-100 sm:gap-4 sm:p-4 dark:bg-gray-700/50 dark:hover:bg-gray-700'>
                    <div className='flex-shrink-0 rounded-xl bg-green-100 p-2 sm:p-3 dark:bg-green-900/30'>
                      <Phone className='h-4 w-4 text-green-600 sm:h-5 sm:w-5 md:h-6 md:w-6 dark:text-green-400' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h4 className='mb-1 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-base dark:text-white'>
                        Phone
                      </h4>
                      <button
                        onClick={handleCall}
                        className='text-xs font-medium break-all text-blue-600 transition-colors duration-300 hover:text-blue-800 hover:underline sm:text-sm md:text-base dark:text-blue-400 dark:hover:text-blue-300'
                      >
                        {businessInfo.phone}
                      </button>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className='flex items-start gap-3 rounded-xl bg-gray-50 p-3 transition-colors duration-300 hover:bg-gray-100 sm:gap-4 sm:p-4 dark:bg-gray-700/50 dark:hover:bg-gray-700'>
                    <div className='flex-shrink-0 rounded-xl bg-orange-100 p-2 sm:p-3 dark:bg-orange-900/30'>
                      <Clock className='h-4 w-4 text-orange-600 sm:h-5 sm:w-5 md:h-6 md:w-6 dark:text-orange-400' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h4 className='mb-2 text-sm font-semibold text-gray-900 sm:mb-3 sm:text-base dark:text-white'>
                        Operating Hours
                      </h4>
                      <div className='space-y-1.5 text-xs text-gray-600 sm:space-y-2 sm:text-sm md:text-base dark:text-gray-300'>
                        <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2'>
                          <span className='flex-shrink-0'>
                            Monday - Saturday:
                          </span>
                          <span className='font-semibold text-gray-900 dark:text-white'>
                            {businessInfo.hours.weekdays}
                          </span>
                        </div>
                        <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2'>
                          <span className='flex-shrink-0'>Sunday:</span>
                          <span className='font-semibold text-gray-900 dark:text-white'>
                            {businessInfo.hours.sunday}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Info Card */}
            <Card className='hover:shadow-3xl border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl backdrop-blur-sm transition-all duration-500 dark:from-blue-900/30 dark:to-blue-800/30'>
              <CardContent className='space-y-4 p-4 md:space-y-6 md:p-6'>
                <h3 className='mb-4 flex items-center gap-2 text-lg font-bold text-blue-900 md:mb-6 md:text-xl dark:text-blue-100'>
                  <span className='text-xl md:text-2xl'>🚀</span>
                  Our Services
                </h3>
                <div className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 md:gap-4'>
                  {[
                    'Free Home Delivery',
                    'Professional Installation',
                    '24/7 Support',
                    'Warranty Service',
                    'Expert Consultation',
                    'Genuine Products',
                  ].map((service, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 rounded-lg p-2 transition-colors duration-300 hover:bg-white/50 md:gap-3 dark:hover:bg-blue-800/20'
                    >
                      <div
                        className='h-2 w-2 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400'
                        style={{ animationDelay: `${index * 200}ms` }}
                      ></div>
                      <span className='font-medium text-blue-800 dark:text-blue-200'>
                        {service}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Emergency Jumpstart Service */}
                <Card className='hover:shadow-3xl border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-2xl backdrop-blur-sm transition-all duration-500 dark:from-red-900/30 dark:to-red-800/30'>
                  <CardContent className='p-4 md:p-8'>
                    <h3 className='mb-2 flex items-center gap-2 text-lg font-bold text-red-900 md:mb-3 md:text-xl dark:text-red-100'>
                      <span className='text-xl md:text-2xl'>🆘</span>
                      Emergency Jumpstart Service
                    </h3>
                    <p className='mb-4 text-xs leading-relaxed text-red-700 md:mb-6 md:text-sm dark:text-red-300'>
                      We provide Emergency Jumpstart Service for your
                      vehicle—call us anytime for fast roadside assistance.
                    </p>
                    <Button
                      onClick={handleCall}
                      className='w-full transform bg-gradient-to-r from-red-600 to-red-700 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-red-800 hover:shadow-xl md:py-3 md:text-base'
                    >
                      <Phone className='mr-2 h-4 w-4 md:mr-3 md:h-5 md:w-5' />
                      Call for Emergency
                      <div className='ml-2 h-2 w-2 animate-ping rounded-full bg-red-300 md:ml-3'></div>
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className='mt-8'>
          <div className='group relative'>
            <div className='group-hover:shadow-3xl aspect-video h-[350px] w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 shadow-2xl transition-all duration-500 dark:border-gray-700'>
              <iframe
                src={businessInfo.embedUrl}
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='R Batteries Auto Electrical Works Location'
                className='h-full w-full transition-all duration-500 group-hover:scale-105'
                onClick={handleDirections}
              />

              {/* Overlay for better visual effect */}
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
