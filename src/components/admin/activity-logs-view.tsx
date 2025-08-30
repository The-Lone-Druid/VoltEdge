'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Activity,
  Search,
  Filter,
  Calendar,
  User,
  RefreshCw,
} from 'lucide-react'

interface ActivityLog {
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

export function ActivityLogsView() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalActivities, setTotalActivities] = useState(0)

  const ITEMS_PER_PAGE = 20

  const fetchActivities = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: ((currentPage - 1) * ITEMS_PER_PAGE).toString(),
      })

      if (searchTerm) params.append('search', searchTerm)
      if (actionFilter !== 'ALL') params.append('action', actionFilter)

      const response = await fetch(`/api/admin/activities?${params}`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
        setTotalActivities(data.total || data.activities.length)
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, actionFilter])

  useEffect(() => {
    fetchActivities()
  }, [currentPage, searchTerm, actionFilter, fetchActivities])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return 'bg-green-100 text-green-800'
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-800'
      case 'CREATE_QUOTATION':
      case 'UPDATE_QUOTATION':
        return 'bg-blue-100 text-blue-800'
      case 'DELETE_QUOTATION':
        return 'bg-red-100 text-red-800'
      case 'ADMIN_ACTION':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUserName = (user: ActivityLog['user']) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }
    return user.email
  }

  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE)

  return (
    <div className='space-y-6'>
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Activity className='h-5 w-5' />
            <span>Activity Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  placeholder='Search by user, action, or description...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className='w-[200px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Filter by action' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Actions</SelectItem>
                <SelectItem value='LOGIN'>Login</SelectItem>
                <SelectItem value='LOGOUT'>Logout</SelectItem>
                <SelectItem value='CREATE_QUOTATION'>
                  Create Quotation
                </SelectItem>
                <SelectItem value='UPDATE_QUOTATION'>
                  Update Quotation
                </SelectItem>
                <SelectItem value='DELETE_QUOTATION'>
                  Delete Quotation
                </SelectItem>
                <SelectItem value='ADMIN_ACTION'>Admin Actions</SelectItem>
                <SelectItem value='UPDATE_PROFILE'>Profile Updates</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant='outline'
              onClick={fetchActivities}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>{totalActivities} total activities</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='space-y-4'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='animate-pulse'>
                  <div className='flex items-center justify-between rounded-lg border p-4'>
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 w-1/4 rounded bg-gray-200'></div>
                      <div className='h-3 w-1/2 rounded bg-gray-200'></div>
                    </div>
                    <div className='h-4 w-24 rounded bg-gray-200'></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>
              No activities found
            </div>
          ) : (
            <div className='space-y-4'>
              {activities.map(activity => (
                <div key={activity.id} className='rounded-lg border p-4'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center space-x-3'>
                        <Badge
                          variant='secondary'
                          className={getActionColor(activity.action)}
                        >
                          {activity.action.replace(/_/g, ' ')}
                        </Badge>
                        <div className='text-muted-foreground flex items-center space-x-1 text-sm'>
                          <User className='h-3 w-3' />
                          <span>{getUserName(activity.user)}</span>
                        </div>
                      </div>

                      <p className='mb-2 text-sm'>{activity.description}</p>

                      <div className='text-muted-foreground flex items-center space-x-4 text-xs'>
                        <div className='flex items-center space-x-1'>
                          <Calendar className='h-3 w-3' />
                          <span>{formatDate(activity.createdAt)}</span>
                        </div>
                        {activity.ipAddress && (
                          <span>IP: {activity.ipAddress}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <>
              <Separator className='my-4' />
              <div className='flex items-center justify-between'>
                <p className='text-muted-foreground text-sm'>
                  Page {currentPage} of {totalPages}
                </p>
                <div className='space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setCurrentPage(prev => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setCurrentPage(prev => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
