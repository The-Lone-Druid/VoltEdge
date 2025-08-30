'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { Loader2, EyeIcon, EyeOffIcon, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import {
  accountSetupSchema,
  type AccountSetupFormData,
} from '@/lib/validations/auth'

export function AccountSetupForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [invitationDetails, setInvitationDetails] = useState<{
    email: string
    dealerName?: string
  } | null>(null)

  const form = useForm<AccountSetupFormData>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setFormError(
          'Invalid invitation link. Please request a new invitation.'
        )
        return
      }

      try {
        const response = await fetch(
          `/api/auth/validate-invitation?token=${token}`
        )
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Invalid invitation token')
        }

        setInvitationDetails(result.invitation)
      } catch (error) {
        console.error('Token validation error:', error)
        setFormError(
          error instanceof Error
            ? error.message
            : 'Invalid invitation link. Please request a new invitation.'
        )
      }
    }

    validateToken()
  }, [token])

  const onSubmit = async (data: AccountSetupFormData) => {
    if (!token) {
      setFormError('Invalid invitation link. Please request a new invitation.')
      return
    }

    setIsLoading(true)
    setFormError('')

    try {
      const response = await fetch('/api/auth/setup-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to setup account')
      }

      setIsSuccess(true)
    } catch (error) {
      console.error('Account setup error:', error)
      setFormError(
        error instanceof Error
          ? error.message
          : 'Failed to setup account. Please try again.'
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
            <CardTitle className='text-2xl'>Account Setup Complete</CardTitle>
            <CardDescription>
              Your account has been successfully created. You can now sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-center'>
              <Button asChild className='w-full'>
                <Link href='/auth/signin'>Sign In to Your Account</Link>
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
          <CardTitle className='text-2xl'>
            Complete Your Account Setup
          </CardTitle>
          <CardDescription>
            {invitationDetails?.dealerName
              ? `Welcome to ${invitationDetails.dealerName}! Complete your account setup below.`
              : 'Complete your account setup below.'}
          </CardDescription>
          {invitationDetails?.email && (
            <div className='bg-muted mt-2 rounded p-2 text-sm'>
              Setting up account for: <strong>{invitationDetails.email}</strong>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert className='mb-4' variant='destructive'>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter your first name'
                          disabled={isLoading || !invitationDetails}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter your last name'
                          disabled={isLoading || !invitationDetails}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          autoComplete='new-password'
                          placeholder='Create a password'
                          disabled={isLoading || !invitationDetails}
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading || !invitationDetails}
                        >
                          {showPassword ? (
                            <EyeOffIcon className='h-4 w-4' />
                          ) : (
                            <EyeIcon className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete='new-password'
                          placeholder='Confirm your password'
                          disabled={isLoading || !invitationDetails}
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isLoading || !invitationDetails}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className='h-4 w-4' />
                          ) : (
                            <EyeIcon className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full'
                disabled={isLoading || !invitationDetails}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Setting Up Account...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </form>
          </Form>

          <div className='mt-6 text-center'>
            <p className='text-muted-foreground text-sm'>
              Already have an account?{' '}
              <Button asChild variant='link' className='h-auto p-0 text-sm'>
                <Link href='/auth/signin'>Sign in here</Link>
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
