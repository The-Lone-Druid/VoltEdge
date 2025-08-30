'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Battery,
  CheckCircle,
  Mail,
  MessageCircle,
  Phone,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

const productCategories = [
  { id: 'batteries', label: 'Batteries', icon: Battery },
  { id: 'inverters', label: 'Inverters', icon: Zap },
  { id: 'accessories', label: 'Accessories', icon: CheckCircle },
  { id: 'installation', label: 'Installation Service', icon: CheckCircle },
]

export function QuoteRequestSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interestedIn: [] as string[],
    urgency: 'normal',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      interestedIn: prev.interestedIn.includes(categoryId)
        ? prev.interestedIn.filter(id => id !== categoryId)
        : [...prev.interestedIn, categoryId],
    }))
  }

  const handleWhatsAppSubmit = () => {
    const categories = formData.interestedIn
      .map(id => productCategories.find(cat => cat.id === id)?.label)
      .join(', ')

    const message = `Hi! I'd like to request a quotation:

📋 *Contact Details:*
Name: ${formData.name}
Phone: ${formData.phone}
${formData.email ? `Email: ${formData.email}` : ''}

🛒 *Interested in:* ${categories || 'General inquiry'}

💬 *Message:*
${formData.message || 'Please provide a detailed quotation.'}

🚨 *Urgency:* ${formData.urgency === 'urgent' ? 'Urgent' : 'Normal'}

Looking forward to your response!`

    window.open(
      `https://wa.me/918446131207?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  const handleEmailSubmit = () => {
    const categories = formData.interestedIn
      .map(id => productCategories.find(cat => cat.id === id)?.label)
      .join(', ')

    const subject = `Quotation Request - ${formData.name}`
    const body = `Hi,

I'd like to request a quotation for the following:

Contact Details:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}

Interested in: ${categories || 'General inquiry'}

Message:
${formData.message || 'Please provide a detailed quotation.'}

Urgency: ${formData.urgency === 'urgent' ? 'Urgent' : 'Normal'}

Thank you!`

    window.open(
      `mailto:contact@rbatteries.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_self'
    )
  }

  const handleCallRequest = () => {
    window.open('tel:+918446131207', '_self')
  }

  const isFormValid = formData.name.trim() && formData.phone.trim()

  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-gray-50 to-white px-4 py-20 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 right-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-400/10'></div>
        <div className='absolute bottom-20 left-20 h-32 w-32 rounded-full bg-orange-500/5 blur-3xl dark:bg-orange-400/10'></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 dark:opacity-10"></div>
      </div>

      <div className='relative mx-auto max-w-6xl'>
        {/* Section Header */}
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600'>
              <MessageCircle className='h-4 w-4 text-white' />
            </div>
            <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
              Get Your Quote
            </span>
          </div>

          <h2 className='mb-6 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white'>
            Request a{' '}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Quote
            </span>
          </h2>
          <p className='mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
            Get a personalized quotation for your electrical needs. Our experts
            will provide detailed pricing and recommendations within 24 hours.
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Quote Form */}
          <div className='lg:col-span-2'>
            <Card className='border-0 bg-white/70 shadow-xl backdrop-blur-sm dark:bg-gray-800/70'>
              <CardHeader className='pb-6'>
                <CardTitle className='flex items-center gap-3 text-2xl text-gray-900 dark:text-white'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-600'>
                    <CheckCircle className='h-4 w-4 text-white' />
                  </div>
                  Tell us about your requirements
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-8'>
                {/* Contact Information */}
                <div className='grid gap-6 sm:grid-cols-2'>
                  <div className='space-y-3'>
                    <Label
                      htmlFor='name'
                      className='font-medium text-gray-700 dark:text-gray-300'
                    >
                      Full Name *
                    </Label>
                    <Input
                      id='name'
                      placeholder='Enter your full name'
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className='h-12 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    />
                  </div>
                  <div className='space-y-3'>
                    <Label
                      htmlFor='phone'
                      className='font-medium text-gray-700 dark:text-gray-300'
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id='phone'
                      placeholder='+91 84461 31207'
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className='h-12 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    />
                  </div>
                </div>

                <div className='space-y-3'>
                  <Label
                    htmlFor='email'
                    className='font-medium text-gray-700 dark:text-gray-300'
                  >
                    Email Address (Optional)
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='your.email@example.com'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className='h-12 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  />
                </div>

                {/* Product Categories */}
                <div className='space-y-4'>
                  <Label className='font-medium text-gray-700 dark:text-gray-300'>
                    What are you interested in?
                  </Label>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    {productCategories.map(category => (
                      <div
                        key={category.id}
                        className='flex items-center space-x-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                      >
                        <Checkbox
                          id={category.id}
                          checked={formData.interestedIn.includes(category.id)}
                          onCheckedChange={() =>
                            handleCategoryToggle(category.id)
                          }
                          className='data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600'
                        />
                        <Label
                          htmlFor={category.id}
                          className='flex cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300'
                        >
                          <category.icon className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Urgency */}
                <div className='space-y-4'>
                  <Label className='font-medium text-gray-700 dark:text-gray-300'>
                    Urgency Level
                  </Label>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='flex items-center space-x-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'>
                      <input
                        type='radio'
                        id='normal'
                        name='urgency'
                        value='normal'
                        checked={formData.urgency === 'normal'}
                        onChange={e =>
                          handleInputChange('urgency', e.target.value)
                        }
                        className='text-blue-600 focus:ring-blue-500'
                      />
                      <Label
                        htmlFor='normal'
                        className='text-gray-700 dark:text-gray-300'
                      >
                        Normal (24-48 hours)
                      </Label>
                    </div>
                    <div className='flex items-center space-x-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'>
                      <input
                        type='radio'
                        id='urgent'
                        name='urgency'
                        value='urgent'
                        checked={formData.urgency === 'urgent'}
                        onChange={e =>
                          handleInputChange('urgency', e.target.value)
                        }
                        className='text-red-600 focus:ring-red-500'
                      />
                      <Label
                        htmlFor='urgent'
                        className='text-gray-700 dark:text-gray-300'
                      >
                        Urgent (Same day)
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className='space-y-3'>
                  <Label
                    htmlFor='message'
                    className='font-medium text-gray-700 dark:text-gray-300'
                  >
                    Additional Details (Optional)
                  </Label>
                  <Textarea
                    id='message'
                    placeholder='Tell us more about your requirements, specific models, quantities, installation needs, etc.'
                    value={formData.message}
                    onChange={e => handleInputChange('message', e.target.value)}
                    className='min-h-[120px] border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  />
                </div>

                {/* Submit Options */}
                <div className='border-t border-gray-200 pt-8 dark:border-gray-600'>
                  <p className='mb-6 text-sm font-medium text-gray-600 dark:text-gray-400'>
                    Choose your preferred way to receive the quotation:
                  </p>
                  <div className='grid gap-4 sm:grid-cols-3'>
                    <Button
                      onClick={handleWhatsAppSubmit}
                      disabled={!isFormValid}
                      className='flex h-12 items-center gap-3 bg-green-600 text-white shadow-lg transition-all duration-300 hover:bg-green-700 hover:shadow-xl'
                    >
                      <MessageCircle className='h-5 w-5' />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={handleEmailSubmit}
                      disabled={!isFormValid}
                      variant='outline'
                      className='flex h-12 items-center gap-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    >
                      <Mail className='h-5 w-5' />
                      Email
                    </Button>
                    <Button
                      onClick={handleCallRequest}
                      variant='outline'
                      className='flex h-12 items-center gap-3 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                    >
                      <Phone className='h-5 w-5' />
                      Call Me
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Sidebar */}
          <div className='space-y-6'>
            <Card className='border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl backdrop-blur-sm dark:from-blue-900/50 dark:to-blue-800/50'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-xl text-blue-900 dark:text-blue-100'>
                  <CheckCircle className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                  Why Request a Quote?
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30'>
                    <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      Best Prices
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Get competitive pricing with exclusive discounts
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30'>
                    <CheckCircle className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      Expert Advice
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Professional recommendations for your specific needs
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30'>
                    <CheckCircle className='h-5 w-5 text-orange-600 dark:text-orange-400' />
                  </div>
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      Free Installation
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Professional installation included with most products
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30'>
                    <CheckCircle className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                  </div>
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      Warranty Support
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Full warranty coverage and after-sales service
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl backdrop-blur-sm dark:from-orange-900/50 dark:to-orange-800/50'>
              <CardContent className='p-6 text-center'>
                <div className='mb-4'>
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600'>
                    <span className='text-2xl'>🏆</span>
                  </div>
                  <h3 className='mb-2 text-lg font-semibold text-orange-900 dark:text-orange-100'>
                    15+ Years of Excellence
                  </h3>
                  <p className='mb-4 text-sm leading-relaxed text-orange-700 dark:text-orange-300'>
                    Over 5000 satisfied customers trust us for their electrical
                    needs
                  </p>
                </div>
                <div className='flex justify-center gap-2'>
                  <Badge
                    variant='secondary'
                    className='bg-white/80 text-orange-800 dark:bg-gray-800/80 dark:text-orange-200'
                  >
                    ⭐ 4.8/5 Rating
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
