'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Users,
  UserPlus,
  MoreHorizontal,
  Mail,
  Shield,
  ShieldOff,
  Clock,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react'
import { InviteUserDialog } from './invite-user-dialog'
import { PageHeader } from '../dashboard/page-header'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: 'MASTER' | 'DEALER'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_INVITATION' | 'SUSPENDED'
  emailVerified: boolean
  createdAt: string
  lastLoginAt: string | null
  invitedBy?: string
}

interface UserActivity {
  id: string
  userId: string
  action: string
  description: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user: {
    email: string
    firstName: string | null
    lastName: string | null
  }
}

export function UserManagementDashboard() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<'ALL' | 'MASTER' | 'DEALER'>(
    'ALL'
  )
  const [selectedStatus, setSelectedStatus] = useState<
    'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING_INVITATION' | 'SUSPENDED'
  >('ALL')
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchUsers()
    fetchActivities()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch {
      console.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/activities?limit=10')
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
      }
    } catch {
      console.error('Failed to fetch activities')
    }
  }

  const handleUserAction = async (
    userId: string,
    action: 'activate' | 'deactivate'
  ) => {
    setActionLoading(userId)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        setMessage(`User ${action}d successfully`)
        fetchUsers() // Refresh user list
        fetchActivities() // Refresh activities
      } else {
        const error = await response.json()
        setMessage(error.message || `Failed to ${action} user`)
      }
    } catch (error) {
      setMessage(`An error occurred while ${action}ing user: ${error}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleResendInvitation = async (userId: string) => {
    setActionLoading(userId)
    setMessage('')

    try {
      const response = await fetch(
        `/api/admin/users/${userId}/resend-invitation`,
        {
          method: 'POST',
        }
      )

      if (response.ok) {
        setMessage('Invitation resent successfully')
        fetchActivities() // Refresh activities
      } else {
        const error = await response.json()
        setMessage(error.message || 'Failed to resend invitation')
      }
    } catch (error) {
      setMessage('An error occurred while resending invitation: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelInvitation = async (userId: string) => {
    if (
      !confirm(
        'Are you sure you want to cancel this invitation? This action cannot be undone.'
      )
    ) {
      return
    }

    setActionLoading(userId)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage('Invitation cancelled successfully')
        fetchUsers() // Refresh user list
        fetchActivities() // Refresh activities
      } else {
        const error = await response.json()
        setMessage(error.message || 'Failed to cancel invitation')
      }
    } catch (error) {
      setMessage('An error occurred while cancelling invitation: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole
    const matchesStatus =
      selectedStatus === 'ALL' || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge variant='default' className='bg-green-100 text-green-800'>
            Active
          </Badge>
        )
      case 'INACTIVE':
        return (
          <Badge variant='secondary' className='bg-red-100 text-red-800'>
            Inactive
          </Badge>
        )
      case 'PENDING_INVITATION':
        return (
          <Badge variant='outline' className='bg-yellow-100 text-yellow-800'>
            Pending
          </Badge>
        )
      case 'SUSPENDED':
        return (
          <Badge variant='secondary' className='bg-orange-100 text-orange-800'>
            Suspended
          </Badge>
        )
      default:
        return <Badge variant='secondary'>{status}</Badge>
    }
  }

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'MASTER':
        return (
          <Badge variant='default' className='bg-purple-100 text-purple-800'>
            Master
          </Badge>
        )
      case 'DEALER':
        return <Badge variant='outline'>Dealer</Badge>
      default:
        return <Badge variant='secondary'>{role}</Badge>
    }
  }

  if (!session || session.user.role !== 'MASTER') {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-12'>
          <p className='text-muted-foreground'>
            Access denied. Master role required.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <PageHeader
        title={'User Management'}
        subtitle={'Manage users, invitations, and permissions'}
        actions={
          <Button onClick={() => setShowInviteDialog(true)}>
            <UserPlus className='mr-2 h-4 w-4' />
            Invite User
          </Button>
        }
      />

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
            <Shield className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {users.filter(u => u.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Invites
            </CardTitle>
            <Clock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {users.filter(u => u.status === 'PENDING_INVITATION').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Dealers</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {users.filter(u => u.role === 'DEALER').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage and monitor all platform users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                <Input
                  placeholder='Search users...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Filter className='mr-2 h-4 w-4' />
                  Role: {selectedRole}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedRole('ALL')}>
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole('MASTER')}>
                  Master
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole('DEALER')}>
                  Dealer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Filter className='mr-2 h-4 w-4' />
                  Status: {selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus('ALL')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('ACTIVE')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('INACTIVE')}>
                  Inactive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus('PENDING_INVITATION')}
                >
                  Pending Invitation
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus('SUSPENDED')}
                >
                  Suspended
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant='outline' onClick={fetchUsers}>
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>

          {/* Users Table */}
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email Verified</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-8 text-center'>
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-8 text-center'>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className='font-medium'>
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.email}
                          </div>
                          <div className='text-muted-foreground text-sm'>
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.emailVerified ? (
                          <Badge
                            variant='default'
                            className='bg-green-100 text-green-800'
                          >
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant='secondary'
                            className='bg-yellow-100 text-yellow-800'
                          >
                            Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              {actionLoading === user.id ? (
                                <RefreshCw className='h-4 w-4 animate-spin' />
                              ) : (
                                <MoreHorizontal className='h-4 w-4' />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            {user.status === 'PENDING_INVITATION' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleResendInvitation(user.id)
                                  }
                                  disabled={actionLoading === user.id}
                                >
                                  <Mail className='mr-2 h-4 w-4' />
                                  Resend Invitation
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCancelInvitation(user.id)
                                  }
                                  disabled={actionLoading === user.id}
                                  className='text-red-600'
                                >
                                  <ShieldOff className='mr-2 h-4 w-4' />
                                  Cancel Invitation
                                </DropdownMenuItem>
                              </>
                            )}
                            {user.status === 'ACTIVE' ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUserAction(user.id, 'deactivate')
                                }
                                disabled={actionLoading === user.id}
                                className='text-red-600'
                              >
                                <ShieldOff className='mr-2 h-4 w-4' />
                                Deactivate
                              </DropdownMenuItem>
                            ) : user.status === 'INACTIVE' ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUserAction(user.id, 'activate')
                                }
                                disabled={actionLoading === user.id}
                                className='text-green-600'
                              >
                                <Shield className='mr-2 h-4 w-4' />
                                Activate
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest user actions and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {activities.length === 0 ? (
              <p className='text-muted-foreground py-4 text-center'>
                No recent activity
              </p>
            ) : (
              activities.map(activity => (
                <div
                  key={activity.id}
                  className='flex items-center space-x-4 rounded-lg border p-4'
                >
                  <div className='flex-1'>
                    <div className='font-medium'>
                      {activity.user.firstName && activity.user.lastName
                        ? `${activity.user.firstName} ${activity.user.lastName}`
                        : activity.user.email}
                    </div>
                    <div className='text-muted-foreground text-sm'>
                      {activity.description}
                    </div>
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    {new Date(activity.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invite User Dialog */}
      <InviteUserDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSuccess={() => {
          fetchUsers()
          fetchActivities()
          setMessage('Invitation sent successfully')
        }}
      />
    </div>
  )
}
