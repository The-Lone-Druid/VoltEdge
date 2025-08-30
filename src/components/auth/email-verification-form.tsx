'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle, Mail } from 'lucide-react'
import Link from 'next/link'

export function EmailVerificationForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (!token) {
      setError(
        'Invalid verification link. Please check your email for the correct link.'
      )
      setIsLoading(false)
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const result = await response.json()

        if (response.ok) {
          setIsSuccess(true)
          // Redirect to sign in after 3 seconds
          setTimeout(() => {
            router.push('/auth/signin?message=email-verified')
          }, 3000)
        } else {
          setError(result.error || 'Failed to verify email')
        }
      } catch (error) {
        console.error('Email verification error:', error)
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [token, router])

  const resendVerification = async () => {
    setIsResending(true)
    try {
      // This would need the user's email, which we don't have here
      // For now, just redirect to resend page
      router.push('/auth/resend-verification')
    } catch (error) {
      console.error('Resend verification error:', error)
    } finally {
      setIsResending(false)
    }
  }

  if (isLoading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='mb-4 flex justify-center'>
              <Loader2 className='text-primary h-12 w-12 animate-spin' />
            </div>
            <CardTitle className='text-2xl'>Verifying Email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='mb-4 flex justify-center'>
              <CheckCircle className='text-primary h-12 w-12' />
            </div>
            <CardTitle className='text-2xl'>Email Verified!</CardTitle>
            <CardDescription>
              Your email address has been successfully verified. You can now
              sign in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4 text-center'>
              <p className='text-muted-foreground text-sm'>
                Redirecting you to sign in page in a few seconds...
              </p>
              <Button asChild className='w-full'>
                <Link href='/auth/signin'>Sign In Now</Link>
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
          <div className='mb-4 flex justify-center'>
            <AlertCircle className='text-destructive h-12 w-12' />
          </div>
          <CardTitle className='text-2xl'>Verification Failed</CardTitle>
          <CardDescription>
            We couldn&apos;t verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-4'>
            <div className='text-center'>
              <p className='text-muted-foreground mb-4 text-sm'>
                The verification link may have expired or is invalid. You can
                request a new verification email.
              </p>

              <div className='space-y-2'>
                <Button
                  onClick={resendVerification}
                  disabled={isResending}
                  className='w-full'
                  variant='outline'
                >
                  {isResending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <Mail className='mr-2 h-4 w-4' />
                      Request New Verification Email
                    </>
                  )}
                </Button>

                <Button asChild variant='ghost' className='w-full'>
                  <Link href='/auth/signin'>Back to Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
