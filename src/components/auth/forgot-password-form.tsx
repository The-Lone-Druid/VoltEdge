'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/lib/validations/auth'
import { requestPasswordReset } from '@/lib/auth-utils'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setFormError('')

    try {
      await requestPasswordReset(data.email)
      setIsSuccess(true)
    } catch (error) {
      console.error('Password reset error:', error)
      setFormError(
        error instanceof Error
          ? error.message
          : 'Failed to send password reset email. Please try again.'
      )
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
            <CardTitle className='text-2xl'>Check Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent password reset instructions to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4 text-center'>
              <p className='text-muted-foreground text-sm'>
                If you don&apos;t see the email in your inbox, check your spam
                folder.
              </p>
              <Button asChild className='w-full'>
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

  return (
    <div className='bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>Reset Your Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset
            your password.
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
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
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
