'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  AlertTriangle,
  Clock,
  Laptop,
  LogOut,
  MapPin,
  Smartphone,
  Tablet,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface UserSession {
  id: string
  sessionToken: string
  userAgent: string
  ipAddress: string
  deviceInfo: string
  isActive: boolean
  createdAt: string
  expiresAt: string
  isCurrent: boolean
}

export function SessionManagement() {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      // Get the current session identifier from localStorage
      const sessionIdentifier = localStorage.getItem('voltedge-session-id')

      const response = await fetch('/api/user/sessions', {
        headers: {
          'x-session-identifier': sessionIdentifier || '',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      } else {
        setMessage('Failed to load sessions')
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      setMessage('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const revokeSession = async (
    sessionId: string,
    isCurrent: boolean = false
  ) => {
    setActionLoading(sessionId)
    setMessage('')

    try {
      const response = await fetch(`/api/user/sessions/${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage('Session revoked successfully')

        // If this is the current session, log out the user
        if (isCurrent) {
          // Clear the session identifier
          localStorage.removeItem('voltedge-session-id')
          setTimeout(() => {
            signOut({ callbackUrl: '/auth/signin?message=session-revoked' })
          }, 1500)
        } else {
          fetchSessions()
        }
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to revoke session')
      }
    } catch (error) {
      console.error('Failed to revoke session:', error)
      setMessage('Failed to revoke session')
    } finally {
      setActionLoading(null)
    }
  }

  const revokeAllSessions = async () => {
    setActionLoading('all')
    setMessage('')

    try {
      const response = await fetch('/api/user/sessions/invalidate-all', {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        setMessage(result.message)

        // Clear the session identifier
        localStorage.removeItem('voltedge-session-id')

        // Show message for a bit then redirect
        setTimeout(() => {
          window.location.href = '/auth/signin?message=session-invalidated'
        }, 3000)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to revoke all sessions')
      }
    } catch (error) {
      console.error('Failed to revoke all sessions:', error)
      setMessage('Failed to revoke all sessions')
    } finally {
      setActionLoading(null)
    }
  }

  const getDeviceIcon = (deviceInfo: string) => {
    if (deviceInfo.includes('Mobile')) return <Smartphone className='h-4 w-4' />
    if (deviceInfo.includes('Tablet')) return <Tablet className='h-4 w-4' />
    return <Laptop className='h-4 w-4' />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active login sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-8'>
            <div className='text-muted-foreground'>Loading sessions...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active login sessions across different devices
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {message && (
          <Alert
            variant={
              message.includes('successfully') ? 'default' : 'destructive'
            }
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Revoke All Sessions */}
        <div className='flex flex-wrap items-center justify-between rounded-lg border p-4'>
          <div className='flex items-center space-x-3'>
            <AlertTriangle className='text-destructive h-5 w-5' />
            <div>
              <p className='font-medium'>Security Action</p>
              <p className='text-muted-foreground text-sm'>
                Log out from all devices and sessions
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='destructive'
                size='sm'
                disabled={actionLoading === 'all'}
              >
                {actionLoading === 'all' ? 'Revoking...' : 'Logout Everywhere'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout from all devices?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will log you out from all devices and sessions. You will
                  need to sign in again on all devices.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={revokeAllSessions}
                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                >
                  Logout Everywhere
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Separator />

        {/* Sessions List */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Your Sessions ({sessions.length})</h4>

          {sessions.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>
              No active sessions found
            </div>
          ) : (
            <div className='space-y-3'>
              {sessions.map(userSession => (
                <div
                  key={userSession.id}
                  className='flex flex-wrap items-center justify-between rounded-lg border p-4'
                >
                  <div className='flex items-center space-x-3'>
                    {getDeviceIcon(userSession.deviceInfo)}
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2'>
                        <p className='font-medium'>{userSession.deviceInfo}</p>
                        {userSession.isCurrent && (
                          <Badge variant='secondary'>Current Session</Badge>
                        )}
                      </div>
                      <div className='text-muted-foreground flex items-center space-x-4 text-sm'>
                        <div className='flex items-center space-x-1'>
                          <MapPin className='h-3 w-3' />
                          <span>{userSession.ipAddress}</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Clock className='h-3 w-3' />
                          <span>
                            Active since {formatDate(userSession.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {userSession.isCurrent ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          disabled={actionLoading === userSession.id}
                        >
                          {actionLoading === userSession.id ? (
                            'Logging out...'
                          ) : (
                            <>
                              <LogOut className='mr-1 h-3 w-3' />
                              Logout Current
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Logout current session?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will log you out of your current session on
                            this device. You will be redirected to the sign-in
                            page.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => revokeSession(userSession.id, true)}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                          >
                            Logout Current Session
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          disabled={actionLoading === userSession.id}
                        >
                          {actionLoading === userSession.id ? (
                            'Revoking...'
                          ) : (
                            <>
                              <LogOut className='mr-1 h-3 w-3' />
                              Logout
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Logout this session?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will log out the session on{' '}
                            {userSession.deviceInfo}. The device will need to
                            sign in again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => revokeSession(userSession.id, false)}
                          >
                            Logout Session
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
