'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2, ArrowLeft, CheckCircle, Mail } from 'lucide-react'
import Link from 'next/link'

const resendVerificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>

export function ResendVerificationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ResendVerificationFormData) => {
    setIsLoading(true)
    setFormError('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setFormError(result.error || 'Failed to send verification email')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setFormError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='mb-4 flex justify-center'>
              <CheckCircle className='text-primary h-12 w-12' />
            </div>
            <CardTitle className='text-2xl'>Verification Email Sent</CardTitle>
            <CardDescription>
              We&apos;ve sent a new verification email to your address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4 text-center'>
              <p className='text-muted-foreground text-sm'>
                Please check your email inbox and click the verification link.
                If you don&apos;t see the email, check your spam folder.
              </p>
              <div className='space-y-2'>
                <Button asChild className='w-full'>
                  <Link href='/auth/signin'>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Back to Sign In
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setIsSuccess(false)}
                  className='w-full'
                >
                  Send Another Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mb-4 flex justify-center'>
            <Mail className='text-primary h-12 w-12' />
          </div>
          <CardTitle className='text-2xl'>Resend Verification Email</CardTitle>
          <CardDescription>
            Enter your email address to receive a new verification link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert className='mb-4' variant='destructive'>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        autoComplete='email'
                        placeholder='Enter your email address'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Sending Verification Email...
                  </>
                ) : (
                  <>
                    <Mail className='mr-2 h-4 w-4' />
                    Send Verification Email
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className='mt-6 text-center'>
            <Button asChild variant='ghost' className='text-sm'>
              <Link href='/auth/signin'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Sign In
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
