'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Loader2, Lock, Mail, Monitor, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { SessionManagement } from './session-management'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export function ProfileSettingsForm() {
  const { data: session, update } = useSession()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  // Get initial tab from URL parameters
  const initialTab = searchParams.get('tab') || 'profile'
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    // Update active tab if URL parameter changes
    const tab = searchParams.get('tab') || 'profile'
    setActiveTab(tab)
  }, [searchParams])

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      email: session?.user?.email || '',
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile')
      }

      // Update the session with new data
      await update({
        firstName: data.firstName,
        lastName: data.lastName,
      })

      setMessage('Profile updated successfully!')
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage(
        error instanceof Error
          ? error.message
          : 'Failed to update profile. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsPasswordLoading(true)
    setPasswordMessage('')

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to change password')
      }

      setPasswordMessage('Password changed successfully!')
      passwordForm.reset()
    } catch (error) {
      console.error('Password change error:', error)
      setPasswordMessage(
        error instanceof Error
          ? error.message
          : 'Failed to change password. Please try again.'
      )
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const requestEmailVerification = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email,
        }),
      })

      if (response.ok) {
        setMessage('Verification email sent! Check your inbox.')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
      <TabsList>
        <TabsTrigger value='profile' className='flex items-center space-x-2'>
          <User className='h-4 w-4' />
          <span>Profile</span>
        </TabsTrigger>
        <TabsTrigger value='security' className='flex items-center space-x-2'>
          <Lock className='h-4 w-4' />
          <span>Security</span>
        </TabsTrigger>
        <TabsTrigger value='sessions' className='flex items-center space-x-2'>
          <Monitor className='h-4 w-4' />
          <span>Sessions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value='profile' className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal details and account information.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Account Status */}
            <div className='flex flex-wrap items-center justify-between rounded-lg border p-4'>
              <div className='flex items-center space-x-3'>
                <Mail className='text-muted-foreground h-5 w-5' />
                <div>
                  <p className='font-medium'>Email Verification</p>
                  <p className='text-muted-foreground text-sm'>
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                {session?.user?.emailVerified ? (
                  <Badge variant='secondary'>
                    <CheckCircle className='mr-1 h-3 w-3' />
                    Verified
                  </Badge>
                ) : (
                  <div className='flex items-center space-x-2'>
                    <Badge variant='destructive'>Unverified</Badge>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={requestEmailVerification}
                    >
                      Resend Verification
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {message && (
              <Alert
                variant={
                  message.includes('successfully') ? 'default' : 'destructive'
                }
              >
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className='space-y-4'
              >
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={profileForm.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter your first name'
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter your last name'
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Enter your email'
                          disabled={true} // Email changes require separate verification
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className='text-muted-foreground text-xs'>
                        Contact support to change your email address
                      </p>
                    </FormItem>
                  )}
                />

                <Button type='submit' disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value='security' className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {passwordMessage && (
              <Alert
                className={
                  passwordMessage.includes('successfully')
                    ? 'mb-4 border-green-200 bg-green-50'
                    : 'mb-4 border-red-200 bg-red-50'
                }
              >
                <AlertDescription>{passwordMessage}</AlertDescription>
              </Alert>
            )}

            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={passwordForm.control}
                  name='currentPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Enter your current password'
                          disabled={isPasswordLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name='newPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Enter your new password'
                          disabled={isPasswordLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Confirm your new password'
                          disabled={isPasswordLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' disabled={isPasswordLoading}>
                  {isPasswordLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value='sessions' className='space-y-6'>
        <SessionManagement />
      </TabsContent>
    </Tabs>
  )
}
